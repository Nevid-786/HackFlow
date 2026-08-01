import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Public instance — no auth needed (login, signup, etc.)
export const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

// Private instance — sends cookies, used for authenticated routes
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends httpOnly cookies (accessToken/refreshToken)
});