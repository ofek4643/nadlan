import axios from "axios";

export const logoutUser = async () =>
  await axios.post("/api/auth/logout", null, { withCredentials: true });

export const registerGuest = async (data) =>
  await axios.post("/api/auth/register", data, { withCredentials: true });

export const loginUser = async (data) =>
  await axios.post("/api/auth/login", data, { withCredentials: true });

export const myUserId = async () =>
  await axios.get(`/api/user`, {
    withCredentials: true,
  });
export const verifyPassword = async (data) =>
  await axios.post(
    `/api/user/verify-password`,
    { password: data },
    {
      withCredentials: true,
    }
  );

export const updateMyInformation = async (data) =>
  await axios.put(`/api/user/update-information`, data, {
    withCredentials: true,
  });
