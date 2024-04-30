import { useNavigate } from 'react-router-dom';
import type { User } from '../../types';
import React, { useEffect, useRef, useState } from 'react';
import { createAxiosInstance } from '../utils/axios-instance';
import toast from 'react-hot-toast';
import config from '../config';
const serverUrl = config.serverUrl;
export default function ProfilePage() {
    const inputRef = useRef<null | HTMLInputElement>(null);
    const [file, setFile] = useState<null | File>(null);
    const navigate = useNavigate();
    const user_from_stroage = localStorage.getItem('user-data');
    const user = user_from_stroage ? JSON.parse(user_from_stroage) as User : undefined;
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.length && e.target.files[0];
        if(!file) return;
        setFile(file);
    }
    const handleUpload = async () => {
        const api = createAxiosInstance();
        const form = new FormData();
        if(!file) return;
        form.append('file', file);
        try {
            const res = await api.post(serverUrl+'/api/user/update-profile-picture', form);
            const user = res.data.user;
            const access_token = res.data.access_token;
            localStorage.setItem('user-data', JSON.stringify(user));
            localStorage.setItem('access_token', access_token);
            toast.success('Profile updated');
            window.location.reload();
        } catch (error) {
            toast.error('Failed to update profile picture');
        }
    }
    const handleClick = () => {
        if (!inputRef.current) return;
        inputRef.current.click();
    }
    useEffect(() => {
        if (!user) navigate('/');
    }, [navigate, user]);
    if (!user)
        return <div>User not found</div>
    return (
        <div className='p-5'>
            <h1 className='text-xl font-medium'>Profile</h1>
            <div className='flex flex-col gap-2'>
                <span >{user.first_name} {user.last_name}</span>
                <span>{user.email}</span>
                <img className='max-w-[100px] max-h-[100px] rounded-full' src={user.profilePicture} alt='P' />
                <input onChange={handleFileChange} ref={inputRef} type='file' placeholder='update profile' className='hidden' />
                <button onClick={handleClick} className='p-2 rounded-md bg-blue-500 w-[120px] text-white font-medium'>Select new profile</button>
                {
                    file && <button onClick={handleUpload} className='p-2 rounded-md w-[120px] bg-blue-500 text-white font-medium'>Upload</button>

                }
            </div>
        </div>
    )
}