import { api } from "./api";

export const dashboardStats = async () =>
  await api.get("/api/admin/dashboard-stats");

export const allUsersAdmin = async () => await api.get("/api/admin/users");

export const getUserAdmin = async (id) =>
  await api.get(`/api/admin/users/${id}`);

export const editUserAdmin = async (data, id) =>
  await api.put(`/api/admin/users/${id}`, data);

export const deleteUser = async (userId) =>
  await api.delete(`/api/admin/${userId}`);

export const blockUser = async (userId) =>
  await api.put(`/api/admin/block/${userId}`, {});
