import axios from "axios";

const host = import.meta.env.VITE_API_HOST || window.location.hostname;
const protocol = window.location.protocol;
const port = import.meta.env.VITE_API_PORT;

console.log(port);

const api = axios.create({
  baseURL: port ? `${protocol}//${host}:${port}/health-api` : `${protocol}//${host}/health-api`,
  withCredentials: true,
});

export default api;
