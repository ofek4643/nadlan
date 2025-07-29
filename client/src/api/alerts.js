import axios from "axios";

export const newAlerts = async () =>
  await axios.get(`/api/alerts/new`, {
    withCredentials: true,
  });

export const createAlert = async (id) =>
  await axios.post(`/api/alerts/${id}`, {
    withCredentials: true,
  });

export const getAllAlerts = async () =>
  await axios.get(`/api/alerts`, {
    withCredentials: true,
  });

export const deleteAlerts = async () =>
  await axios.delete(`/api/alerts`, {
    withCredentials: true,
  });

export const deleteAlert = async (id) =>
  await axios.delete(`/api/alerts/${id}`, {
    withCredentials: true,
  });

export const readAlert = async (id) =>
  await axios.put(`/api/alerts/${id}`, {} ,{
    withCredentials: true,
  });
