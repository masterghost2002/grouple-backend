import {useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { createAxiosInstance } from "../utils/axios-instance";
type props<T> = {
    url:string,
    defaultValues:T
}
const useFetch = <T>({url, defaultValues}:props<T>) => {
    const [data, setData] = useState<T>(defaultValues);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const abortRef = useRef<AbortController | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if(abortRef.current)
                abortRef.current.abort();
            const abort = new AbortController();
            try {
                const api = createAxiosInstance();
                const res = await api.get(url, { signal: abort.signal });
                setData(res.data);
            }
            catch (err:any) {
                console.log(err);
                const errorMessage = err.response?.data?.error?.message || err.message;
                setError(errorMessage);
                toast.error(errorMessage);
            }
            setLoading(false);
        };
        fetchData();
        ()=>abortRef.current?.abort();
    }, [url]);
    return { data, error, loading, setData };
};
export default useFetch;