import { getCookie } from "@/utility/cookie";
import axios from "axios";

const host = import.meta.env.VITE_API_HOST;

const api = axios.create({
  baseURL: `${host}`,
  withCredentials: true,
  headers: {
    authorization: getCookie("token") || "",
  },
});

export default api;
