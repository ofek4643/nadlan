import api from "./api";

export const newAlerts = async () => await api.get(`/alerts/new`);

export const createAlert = async (id) => await api.post(`/alerts/${id}`);

export const getAllAlerts = async () => await api.get(`/alerts`);

export const deleteAlerts = async () => await api.delete(`/alerts`);

export const deleteAlert = async (id) => await api.delete(`/alerts/${id}`);

export const readAlert = async (id) => await api.put(`/alerts/${id}`, {});
