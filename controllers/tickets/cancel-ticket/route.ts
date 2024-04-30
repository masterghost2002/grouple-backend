import { Request, Response } from "express";
import { ROLE, TicketStatus } from "@prisma/client";
import cancelTicketDataValidator from "./validator.schema";
import prisma from "../../../prisma";
import { getIO } from "../../../utils/socket-provider";
export default async function PUT(req:Request, res:Response) {
    if(!req.user) return res.status(400).json("Unauthorized");
    const data = req.body;
    try {
        const io = getIO();
        const validationResult = cancelTicketDataValidator.safeParse(data);
        if(!validationResult.success)
            return res.status(400).json({isError:true, result:validationResult.error.errors});
        const cancelTicketData = validationResult.data;

        // first find the ticket and validate correct user
        const ticket = await prisma.ticket.findUnique({
            where:{
                id:cancelTicketData.ticketId
            }
        });

    
        if(!ticket)
                return res.status(404).json({isError:true, result:{message:"Ticket not found"}});
        
        // check if the logged user is the owner of the ticket, or the logged user id admin
        if(ticket.userID !== req.user.id && req.user.role !== ROLE.AMDIN)
            return res.status(400).json("You are not the owner of ticket");

        //if the ticket is in already cancel state
        if(ticket.status === TicketStatus.CANCELED)
            return res.status(400).json({isError:true, result:{message:"Ticket is already in cancelled state"}});

        // find the movie and check if the movie show time is in past
        const movie = await prisma.movie.findUnique({
            where:{
                id:ticket.movieId
            }
        });

        if(!movie)
            return res.status(404).json("Movie corresponding in the ticket not found");

        // if the show time of movie become past, then the user can't cancel the ticket
        const show_time = new Date(movie.show_time);
        const current_time = new Date();

        if(show_time<=current_time)
            return res.status(400).json({isError:true, result:{message:"Failed to cancel ticket, the show time of movie is expired"}});

        const new_ticket = await prisma.$transaction([
            prisma.movie.update({
                where:{
                    id:ticket.movieId
                },
                data:{
                    seat_available:{
                        increment:ticket.value
                    }
                }
            }),
            prisma.ticket.update({
                where:{
                    id:ticket.id
                },
                data:{
                    status:TicketStatus.CANCELED
                }
            })
        ]);
        io.emit('CANCEL_TICKET', {id:new_ticket[1].id});
        return res.status(201).json(new_ticket);
    } catch (error) {
        return res.status(500).json({isError:true, result:{message:"Internal server error"}});
    }
}