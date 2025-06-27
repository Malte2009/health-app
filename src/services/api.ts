import { getCookie } from "@/utility/cookie";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "authorization": getCookie("token") || ""
  }
});

export default api;
