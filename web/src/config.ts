const serverUrlFromEnv = import.meta.env.VITE_SERVER_URL;
const config  = {
    serverUrl: !serverUrlFromEnv?'http://localhost:5000':serverUrlFromEnv as string,
}
export default config;