import { getCookie } from "@/utility/cookie";
import axios from "axios";

const host = window.location.hostname;

const api = axios.create({
  baseURL: `http://${host}:3000/api`,
  withCredentials: true,
  headers: {
    authorization: getCookie("token") || "",
  },
});

export default api;
