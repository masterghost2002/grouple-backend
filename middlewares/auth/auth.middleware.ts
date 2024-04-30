import {Response, Request, NextFunction} from 'express';
import { ROLE } from '@prisma/client';
import jwt, {Secret} from 'jsonwebtoken';
import Cache from '../../utils/cache';
import { UserWithoutPassword } from '../../types';
import prisma from '../../prisma';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
const jwtSecret:Secret = process.env.JWT_SECRET as string;
const cacheInstance = Cache.getCache();
const validateToken = async (access_token:string) =>{
    if(!access_token || typeof access_token !== 'string')
        return undefined;
    try {
        const result = await jwt.verify(access_token.replace('Bearer ', ''), jwtSecret) as UserWithoutPassword;
        if(!result) return undefined;
        return result;
    } catch (error) {
        return undefined;
    }
}
const findUserFromDB = async (access_token:string)=>{
    const result = await validateToken(access_token);
    if(!result) return undefined;

    // first check is the user available in the cache or not, if available the return from cache
    const userFromCache = cacheInstance.cache.get(result.id) as UserWithoutPassword | undefined;
    if(userFromCache)
        return userFromCache;
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:result.id
            }
        });
        if(!user)
            return undefined;
        const {hash_password:_, ...latest_user} = user;
        // cache the user for 120 sec in the memory
        cacheInstance.cache.set(user.id, latest_user, 120);
        return latest_user;
    } catch (error) {
        return undefined;
    }
}
const validateUser = async (req:Request, res:Response, next:NextFunction)=>{
    const access_token = req.cookies.access_token || req.headers['access_token'];
    const user = await findUserFromDB(access_token);
    if(!user) return res.status(401).json({isError:true, result:{message:"User not found"}});
    req.user = user;
    next();
}
const validateAdmin = async (req:Request, res:Response, next:NextFunction)=>{
    const access_token = req.cookies.access_token || req.headers['access_token'];
    const user = await findUserFromDB(access_token);
    if(!user) return res.status(401).json({isError:true, result:{message:"User not found"}});
    if(user.role !== ROLE.AMDIN) return res.status(400).json({isError:true, result:{message:"Invalid role"}});
    req.user = user;
    next();
};
const validateAdminInSocket = async (socket:Socket, next:(err?:ExtendedError | undefined)=>void)=>{
    const access_token:string | undefined = socket.handshake.headers.authorization;
    if(!access_token) return next(new Error('Authentication Error; token missing'));
    const user = await findUserFromDB(access_token);
    if(!user) return next(new Error('User not found'));
    if(user.role !== ROLE.AMDIN) return next(new Error('User is not adming'));
    next();
};
const auth = {validateAdmin, validateUser, validateAdminInSocket};
export default auth;