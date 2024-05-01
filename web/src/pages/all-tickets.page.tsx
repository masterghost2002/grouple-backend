import useFetch from "../hooks/useFetch";
import type { TicketType } from "../../types";
import useSocket from "../hooks/useSocket";
import { useEffect } from "react";
import config from "../config";
const serverUrl = config.serverUrl;
export default function AllTicketsPage() {
    const { data: tickets, setData: setTickets, loading } = useFetch<Array<TicketType>>({ url: serverUrl + '/api/ticket?order=desc', defaultValues: [] });
    const socket = useSocket();
    useEffect(() => {
        if (!socket) return;
        socket.on('NEW_TICKET', (data: any) => {
            const ticket = data[1] as TicketType;
            ticket.movie = data[0];
            setTickets(prev => [ticket, ...prev]);
        });
        socket.on('CANCEL_TICKET', ({id}: {id:string}) => {
            // first find in tickets
            setTickets(prev=>{
                const _new_tickets = [...prev];
                const index = _new_tickets.findIndex(ticket => ticket.id === id);
                if(index === -1) return prev;
                _new_tickets[index].status = 'CANCELLED';
                return _new_tickets;

            })
        });
    }, [socket]);
    return (
        <div className="p-5">
            <h1 className="text-xl font-bold">Live Tickets</h1>
            <div className='flex flex-col gap-5'>
               
                {

                    !loading && tickets.map((ticket) => {
                        return (
                            <div key={ticket.id} className='flex flex-col gap-2 border-2 rounded-md p-2'>
                                <span className='text-md font-bold'>Ticket id: {ticket.id}</span>
                                <span className='text-md font-bold'>User id: {ticket.userID}</span>
                                <span className={`text-md font-bold ${ticket.status === 'CONFIRM' ? 'bg-green-200 text-green-900' : 'bg-red-500 text-red-900'} w-[100px] rounded-md p-2`}>{ticket.status}</span>
                                <span className='text-md font-bold'>Movie Name {ticket.movie.name}</span>
                                <span>Book  Time: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                <span>Show  Time: {new Date(ticket.movie.show_time).toLocaleDateString()}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}