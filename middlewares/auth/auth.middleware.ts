import {Response, Request, NextFunction} from 'express';
import { ROLE } from '@prisma/client';
import jwt, {Secret} from 'jsonwebtoken';
import Cache from '../../utils/cache';
import { UserWithoutPassword } from '../../types';
import prisma from '../../prisma';
const jwtSecret:Secret = process.env.JWT_SECRET as string;
const cacheInstance = Cache.getCache();
const validateToken = async (req:Request) =>{
    const access_token = req.cookies.access_token || req.headers['access_token'];
    if(!access_token)
        return undefined;
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

    // first check is the user available in the cache or not, if available the return from cache
    const userFromCache = cacheInstance.cache.get(result.id) as UserWithoutPassword | undefined;
    if(userFromCache){
        req.user = userFromCache;
        return userFromCache;
    }
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:result.id
            }
        });
        if(!user)
            return undefined;
        const {hash_password:_, ...latest_user} = user;
        req.user = latest_user;
        // cache the user for 120 sec in the memory
        cacheInstance.cache.set(user.id, latest_user, 120);
        return latest_user;
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