import {Response, Request, NextFunction} from 'express';
import jwt, {Secret} from 'jsonwebtoken';
import { UserWithoutPassword } from '../../types';
import prisma from '../../prisma';
import { ROLE } from '@prisma/client';
const jwtSecret:Secret = process.env.JWT_SECRET as string;
const validateToken = async (req:Request) =>{
    const access_token = req.cookies.access_token || req.headers['access_token'];
    const splited_token = access_token.split(' ');

    // there can be two case, token is from cokkies or from header if it is from header it will be in form of Bearer token
    const token  = splited_token.length === 2?splited_token[1]:splited_token[0];
    if(!token || typeof token !== 'string')
        return undefined;
    try {
        const result = await jwt.verify(token, jwtSecret) as UserWithoutPassword;
        if(!result) return undefined;
        return result;
    } catch (error) {
        return undefined;
    }
}
const findUserFromDB = async (req:Request)=>{
    const result = await validateToken(req);
    if(!result) return undefined;
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:result.id
            }
        });
        if(!user)
            return undefined;
        req.user = result;
        return result;
    } catch (error) {
        return undefined;
    }
}
const validateUser = async (req:Request, res:Response, next:NextFunction)=>{
    const user = await findUserFromDB(req);
    if(!user) return res.status(401).json({isError:true, result:{message:"User not found"}});
    next();
}
const validateAdmin = async (req:Request, res:Response, next:NextFunction)=>{
    const user = await findUserFromDB(req);
    if(!user) return res.status(401).json({isError:true, result:{message:"User not found"}});
    if(user.role !== ROLE.AMDIN) return res.status(400).json({isError:true, result:{message:"Invalid role"}});
    next();
};
const auth = {validateAdmin, validateUser};
export default auth;