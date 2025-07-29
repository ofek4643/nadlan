import axios from "axios";

const baseURL = import.meta.env.DEV
  ? "" // ב־localhost proxy מטפל בזה
  : "https://nadlan-lxn4.onrender.com"; // production

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
