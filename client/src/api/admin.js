import api from "./api";

export const dashboardStats = async () =>
  await api.get(`/admin/dashboard-stats`);

export const allUsersAdmin = async () =>
  await api.get(`/admin/users`);

export const getUserAdmin = async (id) =>
  await api.get(`/admin/users/${id}`);

export const editUserAdmin = async (data, id) =>
  await api.put(`/admin/users/${id}`, data);

export const deleteUser = async (userId) =>
  await api.delete(`/admin/${userId}`);

export const blockUser = async (userId) =>
  await api.put(`/admin/block/${userId}`, {});