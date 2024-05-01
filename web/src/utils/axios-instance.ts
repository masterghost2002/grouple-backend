import axios, { AxiosInstance } from 'axios';
const serverUrl = import.meta.env.VITE_SERVER_URL;
const api: AxiosInstance = axios.create({
  baseURL: serverUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
function createAxiosInstance() {
    const access_token = localStorage.getItem('access_token');
    return axios.create({
        baseURL: serverUrl,
        headers: {
            'access_token': `Bearer ${access_token}`
        }
    });
}
export {createAxiosInstance};
export default api;