import { Request, Response } from "express";
import prisma from "../../../prisma";
import Cache from "../../../utils/cache";
const cacheInstance = Cache.getCache();
export default async function GET(req:Request, res:Response){
    const movieId = req.params.id;
    const movieFromCache = cacheInstance.cache.get(movieId);
    if(movieFromCache)
        return res.status(200).json(movieFromCache);
    try {
        const movie = await prisma.movie.findUnique({
            where:{
                id:movieId
            }
        });
        if(movie)
        cacheInstance.cache.set(movie.id,movie, 60);
        return res.status(200).json(movie);
    } catch (error) {
        return res.status(500).json("Internal server error");
    }
}