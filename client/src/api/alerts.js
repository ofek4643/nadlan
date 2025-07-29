import { api } from "./api";

export const newAlerts = async () => await api.get("/api/alerts/new");

export const createAlert = async (id) => await api.post(`/api/alerts/${id}`);

export const getAllAlerts = async () => await api.get("/api/alerts");

export const deleteAlerts = async () => await api.delete("/api/alerts");

export const deleteAlert = async (id) => await api.delete(`/api/alerts/${id}`);

export const readAlert = async (id) => await api.put(`/api/alerts/${id}`, {});
