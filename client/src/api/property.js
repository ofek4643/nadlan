import { api } from "./api";

export const addProperty = async (data) =>
  await api.post(`/api/property/add-property`, data);

export const filterProperties = async (data) =>
  await api.post(`/api/property/filter`, data);

export const getProperties = async (params) =>
  await api.get(`/api/property`, { params });

export const getPropertyById = async (id) =>
  await api.get(`/api/property/${id}`);

export const updatePropertyById = async (data, id) =>
  await api.put(`/api/property/${id}`, data);

export const myUserProperties = async () =>
  await api.get(`/api/property/my-properties`);

export const deletePropertyById = async (id) =>
  await api.delete(`/api/property/${id}`);
