import { Request, Response } from "express";
import signInForm from "./validator.schema";
import type { signInFormType } from "./validator.schema";
import prisma from "../../../prisma";
import cryptr from "../../../utils/cryptr";
import jwtToken from "../../../utils/jwt-token";
export default async function POST(req:Request, res:Response){
    const data = req.body;
    try {
        // validate the data using zod
        const validationResult = signInForm.safeParse(data);
        if(!validationResult.success)
            return res.status(400).json({isError:true, result:validationResult.error.errors});

        const signInData = validationResult.data as signInFormType;

        // find the user
        const user = await prisma.user.findFirst({
            where:{
                email:signInData.email
            }
        });
        if(!user)
            return res.status(404).json({isError:true, result:{message:"User not found"}});

        // validate password
        const decrypted_password = cryptr.decrypt(user.hash_password);
        if(decrypted_password !== signInData.password)
            return res.status(401).json({isError:true, result:{message:"Password in incorrect"}});

        const {hash_password:_, ...user_without_password} = user;
        const access_token = await jwtToken(user_without_password);
        res.cookie('access_token', access_token, {httpOnly:true, secure:true, maxAge:3600000});
        return res.status(200).json({user:user_without_password, access_token});
    } catch (error) {
        console.log(error);
        return res.status(500).json({isError:true, result:{message:"Internal server error"}});
    }
}