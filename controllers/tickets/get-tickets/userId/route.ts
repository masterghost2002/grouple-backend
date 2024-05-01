import { Request, Response } from "express";
import prisma from "../../../../prisma";
export default async function GET(req:Request, res:Response){
    if(!req.user)
        return res.status(404).json("Unauthorized");
    try {
        const tickets = await prisma.ticket.findMany({
            where:{
                userID:req.user.id
            }
        });
        return res.status(200).json(tickets);
    } catch (error) {
        return res.status(500).json({isError:true, result:{message:"Internal server error"}});
    }
}