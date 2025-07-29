import axios from "axios";

export const dashboardStats = async () =>
  await axios.get(`/api/admin/dashboard-stats`, {
    withCredentials: true,
  });

export const allUsersAdmin = async () =>
  await axios.get(`/api/admin/users`, {
    withCredentials: true,
  });

export const getUserAdmin = async (id) =>
  await axios.get(`/api/admin/users/${id}`, {
    withCredentials: true,
  });

export const editUserAdmin = async (data, id) =>
  await axios.put(`/api/admin/users/${id}`, data, {
    withCredentials: true,
  });

export const deleteUser = async (userId) =>
  await axios.delete(`/api/admin/${userId}`, {
    withCredentials: true,
  });

export const blockUser = async (userId) =>
  await axios.put(`/api/admin/block/${userId}`, {}, { withCredentials: true });
