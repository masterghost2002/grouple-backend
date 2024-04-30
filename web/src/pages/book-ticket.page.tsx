import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import type { MovieType } from "../../types";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { createAxiosInstance } from "../utils/axios-instance";
import config from "../config";
const serverUrl = config.serverUrl;
export default function BookTicketPage() {
    const navigate = useNavigate();
    const { id: movieId } = useParams();
    const [value, setValue] = useState(1);
    const { data: movie, loading } = useFetch<MovieType | undefined>({ url: serverUrl + '/api/movies/' + movieId, defaultValues: undefined });

    const handleOnSubmit  = async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            const api = createAxiosInstance();
            await api.post(serverUrl+'/api/ticket/book-ticket', {movieId, value});
            toast.success('Ticket booking success');
            navigate('/');
        } catch (error) {
            toast.error('Failed to book ticket');            
        }
    }
    if (loading)
        return <div className="text-xl font-bold p-5">
            Hold on we are fetching latest movie data !
        </div>
    return (
        <div className="p-5">
            {
                movie && (
                    <div className="flex flex-col gap-2">
                        <span className='text-md font-bold'>{movie.name}</span>
                        <span>Show Time: {new Date(movie.show_time).toLocaleDateString()}</span>
                        <span>Seat Available: {movie.seat_available}</span>
                        <form className="" onSubmit={handleOnSubmit}>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="value">Enter number of seats</label>
                                <input
                                    name="value"
                                    placeholder="Number of seats"
                                    id="value"
                                    defaultValue={value}
                                    type="number"
                                    onChange={e => setValue(Number(e.target.value))}
                                />
                            </div>
                            <button className="p-2 text-md font-medium bg-blue-400 text-white rounded-md cursor-pointer">
                                Confirm Booking
                            </button>
                        </form>
                    </div>
                )
            }
        </div>
    )
};