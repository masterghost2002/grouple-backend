import useFetch from '../hooks/useFetch';
import type { MovieType, User } from '../../types';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from '../config';
export default function HomePage() {

    const navigate = useNavigate();
    const [page, setPage] = useState('1');
    const [limit, setLimit] = useState('10');
    const [order, setOrder] = useState('asc');
    const { data: movies, loading } = useFetch<Array<MovieType>>({
        url: config.serverUrl + `/api/movies?page=${page}&limit=${limit}&order=${order}`,
        defaultValues: []
    });
    const user_from_stroage = localStorage.getItem('user-data');
    const user = user_from_stroage ? JSON.parse(user_from_stroage) as User : undefined;
    const handleSignOut = ()=>{
        localStorage.clear();
        window.location.reload();
    }
    return (<div className='p-10'>
        <h1 className='text-[32px] font-bold'>Latest Movies</h1>
        <div className='flex gap-2 justify-evenly'>
            {user && <div className='flex gap-2'>
                <Link to={'/all-tickets'} className='p-2 rounded-md bg-blue-700 text-white'>View All Tickets</Link>
                <Link to={'/profile'} className='p-2 rounded-md bg-blue-700 text-white'>Profile</Link>
                <button onClick={handleSignOut} className='p-2 rounded-md bg-blue-700 text-white'>Sign Out</button>
                </div>
            }
            {!user && <div className='flex gap-2'>
                <Link to={'/sign-in'} className='p-2 rounded-md bg-blue-700 text-white'>Sign IN</Link>
                <Link to={'/sign-up'} className='p-2 rounded-md bg-blue-700 text-white'>Sign UP</Link>
                </div>
            }
        </div>
        <div className='flex gap-2 my-5'>
            <span className='text-xl font-medium'>Filter Section</span>
            <div className='flex gap-2 items-center'>
                <label htmlFor='limit'>Limit:</label>
                <input className='' value={limit} onChange={(e) => setLimit(e.target.value)} name='limit' id='limit' placeholder='limit' />
            </div>
            <div className='flex gap-2 items-center'>
                <label htmlFor='page'>Page:</label>
                <input className='' name='page' value={page} onChange={(e) => setPage(e.target.value)} id='page' placeholder='page' />
            </div>
            <div className='flex gap-2 items-center'>
                <label htmlFor='page'>Show Time:</label>
                <select id="show_time" onChange={(e) => setOrder(e.target.value)}>
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
                            <button onClick={() => navigate('/book-ticket/' + movie.id)} className='rounded-md p-2 bg-blue-300 w-[200px] text-md font-bold cursor-pointer'>View and Book Ticket</button>
                        </div>
                    )
                })
            }
        </div>
    </div>)
}