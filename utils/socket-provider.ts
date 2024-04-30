import {Server as HTTPServer } from 'http';
import {Server} from 'socket.io';
import auth from '../middlewares/auth/auth.middleware';
let io:Server | undefined = undefined;
export function initSocket(httpServer:HTTPServer){
    io = new Server(httpServer, {
        cors:{
            origin:'*'
        }
    });
    io.use(auth.validateAdminInSocket);
    io.on('connection', ()=>console.log('User is connected'));
    return io;
};
export function getIO(){
    if(!io)
        throw new Error('Socket.io has not been initialized');
    return io;
}