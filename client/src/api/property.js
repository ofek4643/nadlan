import api from "./api";

export const addPropery = async (data) =>
  await api.post(`/property/add-property`, data);

export const filterProperies = async (data) =>
  await api.post(`/property/filter`, data);

export const getProperies = async () => await api.get(`/property`);

export const getPropertyById = async (id) => await api.get(`/property/${id}`);

export const updatePropertyById = async (data, id) =>
  await api.put(`/property/${id}`, data);

export const myPropeties = async () => await api.get(`/property/my-properties`);

export const deletePropertyById = async (id) =>
  await api.delete(`/property/${id}`);
