import { Request, Response } from "express";
import signUpForm from "./validator.schema";
import type { signUpFormType } from "./validator.schema";
import prisma from "../../../prisma";
import cryptr from "../../../utils/cryptr";
export default async function POST(req:Request, res:Response){
    const data = req.body;
    try {
        // validate the data using zod
        const validationResult = signUpForm.safeParse(data);
        if(!validationResult.success)
            return res.status(400).json({isError:true, result:validationResult.error.errors});

        const signUpData = validationResult.data as signUpFormType;

        // check is the user exist of not using email
        const user  = await prisma.user.findFirst({
            where:{
                email: signUpData.email
            }
        });
        // if the user already exist return error
        if(user)
            return res.status(409).json({isError:true, result:{message:"User already exist"}});
        
        // create a new user
        const hash_password = cryptr.encrypt(signUpData.password);
        const new_user = await prisma.user.create({
            data:{
                email:signUpData.email,
                first_name:signUpData.first_name,
                last_name:signUpData.last_name,
                hash_password
            }
        });
        const {hash_password:_, ...user_without_password} = new_user;
        return res.status(201).json({message:"User created", user:user_without_password});
    } catch (error) {
        console.log(error);
        return res.status(500).json({isError:true, result:{message:"Internal server error"}});
    }
}