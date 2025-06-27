import axios from "axios";

const host = window.location.host;

const api = axios.create({
  baseURL: `http://${host}:3000/api`,
  withCredentials: true,
});

export default api;
