import api from "./api";

export const logoutUser = async () => await api.post("/auth/logout", null);

export const registerGuest = async (data) =>
  await api.post("/auth/register", data);

export const loginUser = async (data) => await api.post("/auth/login", data);

export const myUserId = async () => await api.get("/user");

export const verifyPassword = async (data) =>
  await api.post("/user/verify-password", { password: data });

export const updateMyInformation = async (data) =>
  await api.put("/user/update-information", data);
