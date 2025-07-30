import axios from "axios";

const baseURL = import.meta.env.DEV
  ? ""
  : "https://nadlan-lxn4.onrender.com";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});