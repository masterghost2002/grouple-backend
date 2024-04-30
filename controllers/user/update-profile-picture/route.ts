import { Request, Response } from "express";
import jwtToken from "../../../utils/jwt-token";
import prisma from "../../../prisma";
export default async function POST(req:Request, res:Response){
    if(!req.user)
        return res.status(404).json({isError:true, result:{message:"Unauthorized"}});
    const {location, key}  = req.file as any;
    try {
        const updatedUser = await prisma.user.update({
            where:{
                id:req.user.id
            },
            data:{
                profilePicture:location,
                key
            }
        });
        const {hash_password:_, ...user} = updatedUser;
        const access_token  = await jwtToken(user);
        return res.status(201).json({user, access_token});
    } catch (error) {
        return res.status(500).json({isError:true, result:{message:"Internal Server Error"}});
    }
}