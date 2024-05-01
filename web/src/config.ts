const serverUrlFromEnv = import.meta.env.VITE_SERVER_URL;
const origin = window.location.origin;
const config  = {
    serverUrl: !serverUrlFromEnv?origin:serverUrlFromEnv as string,
}
export default config;