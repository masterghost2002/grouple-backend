import { Request, Response } from "express";
import addMovieDataValidator from "./validation.schema";
import prisma from "../../../prisma";
export default async function DELETE(req:Request, res:Response){
    const data = req.body;
    try {
        const validationResult = addMovieDataValidator.safeParse({...data, show_time:new Date(data.show_time)});
        if(!validationResult.success)
            return res.status(400).json({isError:true, result:validationResult.error.errors});
        const deleteMovieData = validationResult.data;
        const movie = await prisma.movie.findUnique({
            where:{
                id:deleteMovieData.movieId
            },
            include:{
                tickets:true
            }
        })
        if(!movie) return res.status(404).json({isError:true, result:{message:"Requested movie not found"}});
        if(movie.tickets.length !== 0)
            if(!movie) return res.status(404).json({isError:true, result:{message:"Cannot delete movies, whose tickets are already  sold"}});
        await prisma.movie.delete({
            where:{
                id:movie.id
            }
        });
        return res.status(201).json("Suceessfully deleted movie");
    } catch (error) {
        return res.status(500).json({isError:true, result:{message:"Internal server error"}});
    }
}