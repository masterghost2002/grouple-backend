import { useEffect, useState } from 'react';
import {io, Socket} from 'socket.io-client';
const serverUrl = import.meta.env.VITE_SERVER_URL;
export default function useSocket():Socket | null{
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(()=>{
        const access_token = localStorage.getItem('access_token');
        const new_socket = io(serverUrl, {
            extraHeaders:{
                Authorization:`Bearer ${access_token}`
            }
        });
        setSocket(new_socket);
        return ()=>{
            if(socket)
                socket.disconnect();
        }
    }, []);
    return socket;
}