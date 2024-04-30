import { Request, Response } from "express";
import prisma from "../../prisma";
import { querySchema } from "../../utils/common.schema";
export default async function GET(req:Request, res:Response){
    try {
        const limit = Number(req.query.limit || 10);
        const page = Number(req.query.page || 1);
        const order = req.query.order;
        const queryValidationResult = querySchema.safeParse({limit, page, order});
        if(!queryValidationResult.success)
            return res.status(400).json({isError:true, result:queryValidationResult});
        const query = queryValidationResult.data;
        const tickets = await prisma.ticket.findMany({
            skip:(query.page-1)*query.limit,
            take:query.limit,
            orderBy:{
                createdAt:query.order
            },
            include:{movie:true}
        });
        return res.status(200).json(tickets);
    } catch (error) {
        return res.status(500).json({isError:true, result:{message:"Internal server error"}});
    }
}