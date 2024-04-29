import { Request, Response } from "express";
import prisma from "../../prisma";
export default async function GET(req:Request, res:Response){
    try {
        const movies = await prisma.movie.findMany({
            select:{id:true, name:true,show_time:true, seat_available:true}
        });
        return res.status(200).json(movies);

    } catch (error) {
        return res.status(500).json("Internal server error");
    }
}