import { api } from "./api";

export const logoutUser = async () => api.post("/api/auth/logout");

export const registerGuest = async (data) =>
  api.post("/api/auth/register", data);

export const loginUser = async (data) => api.post("/api/auth/login", data);

export const myUserId = async () => api.get("/api/user");

export const verifyPassword = async (data) =>
  api.post("/api/user/verify-password", { password: data });

export const updateMyInformation = async (data) =>
  api.put("/api/user/update-information", data);
