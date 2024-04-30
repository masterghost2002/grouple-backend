import useFetch from '../hooks/useFetch';
import type { MovieType } from '../../types';
import { useState } from 'react';
const serverUrl = import.meta.env.VITE_SERVER_URL;
export default function HomePage() {
    
    const [page, setPage] = useState('1');
    const [limit, setLimit] = useState('10');
    const [order, setOrder] = useState('asc');
    const { data: movies, loading } = useFetch<Array<MovieType>>({
        url: serverUrl + `/api/movies?page=${page}&limit=${limit}&order=${order}`,
        defaultValues: []
    });
    return (<div className='p-10'>
        <h1 className='text-[32px] font-bold'>Latest Movies</h1>
        <div className='flex gap-2 my-5'>
            <span className='text-xl font-medium'>Filter Section</span>
            <div className='flex gap-2 items-center'>
                <label htmlFor='limit'>Limit:</label>
                <input className='' value={limit} onChange={(e)=>setLimit(e.target.value)} name='limit' id='limit' placeholder='limit' />
            </div>
            <div className='flex gap-2 items-center'>
                <label htmlFor='page'>Page:</label>
                <input className='' name='page' value={page} onChange={(e)=>setPage(e.target.value)} id='page' placeholder='page' />
            </div>
            <div className='flex gap-2 items-center'>
                <label htmlFor='page'>Show Time:</label>
                <select id="show_time" onChange={(e)=>setOrder(e.target.value)}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>
        </div>
        {
            loading && <div>Loading Movies List</div>
        }
        <div className='flex flex-col gap-5'>
            {
               !loading && movies.map((movie) => {
                    return (
                        <div key={movie.id} className='flex flex-col gap-2 border-2 rounded-md p-2'>
                            <span className='text-md font-bold'>{movie.name}</span>
                            <span>Show Time: {new Date(movie.show_time).toLocaleDateString()}</span>
                            <button className='rounded-md p-2 bg-blue-300 w-[200px] text-md font-bold cursor-pointer'>View and Book Ticket</button>
                        </div>
                    )
                })
            }
        </div>
    </div>)
}