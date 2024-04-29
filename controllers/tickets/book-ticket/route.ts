import { Request, Response } from "express";
import bookTicketDataValidator from "./validator.schema";
import prisma from "../../../prisma";
export default async function POST(req:Request, res:Response){
    const data = req.body;
    if(!req.user) return res.status(404).json("Unauthorized");
    try {
        const validationResult = bookTicketDataValidator.safeParse(data);
        if(!validationResult.success)
            if(!validationResult.success)
                return res.status(400).json({isError:true, result:validationResult.error.errors});
        const bookTicketData = validationResult.data;

        // first find the movie and check if the required seats are available
        const movie = await prisma.movie.findUnique({
            where:{
                id:bookTicketData.movieId
            }
        });
        if(!movie)
            return res.status(404).json({isError:true, result:{message:"Movie not found"}});
        if(movie.seat_available - data.value < 0)
            return res.status(400).json({isError:true, result:{message:"Seat are not available"}});

        // as we have to update different tables which are based on same event run transaction, in case of one updation failed it prevent data corruption
        const ticket = await prisma.$transaction([
            prisma.movie.update({
                where:{
                    id:bookTicketData.movieId
                },
                data:{
                    seat_available:{
                        decrement:bookTicketData.value
                    }
                }
            }),
            prisma.ticket.create({
                data:{
                    value:bookTicketData.value,
                    user:{
                        connect:{id:req.user.id}
                    },
                    movie:{
                        connect:{id:movie.id}
                    }
                },
            })
        ]);
        return res.status(201).json(ticket);
    } catch (error) {
        return res.status(500).json("Internal Server error");
    }
};
