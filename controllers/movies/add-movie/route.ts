import { Request, Response } from "express";
import addMovieDataValidator from "./validation.schema";
import prisma from "../../../prisma";
export default async function POST(req:Request, res:Response){
    const data = req.body;
    try {
        const validationResult = addMovieDataValidator.safeParse({...data, show_time:new Date(data.show_time)});
        if(!validationResult.success)
            return res.status(400).json({isError:true, result:validationResult.error.errors});
        const addMovieData = validationResult.data;
        const movie = await prisma.movie.create({
            data:addMovieData
        });
        return res.status(201).json(movie);
    } catch (error) {
        return res.status(500).json({isError:true, result:{message:"Internal server error"}});
    }
}