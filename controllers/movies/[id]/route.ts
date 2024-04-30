import { Request, Response } from "express";
import prisma from "../../../prisma";
export default async function GET(req:Request, res:Response){
    const movieId = req.params.id;
    try {
        const movie = await prisma.movie.findUnique({
            where:{
                id:movieId
            }
        });
        return res.status(200).json(movie);
    } catch (error) {
        return res.status(500).json("Internal server error");
    }
}