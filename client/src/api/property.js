import axios from "axios";
export const addPropery = async (data) =>
  await axios.post(`/api/property/add-property`, data, {
    withCredentials: true,
  });

export const filterProperies = async (data) =>
  await axios.post(`/api/property/filter`, data, { withCredentials: true });

export const getProperies = async (data) =>
  await axios.get(`/api/property`, data, { withCredentials: true });

export const getPropertyById = async (id) =>
  await axios.get(`/api/property/${id}`, { withCredentials: true });

export const updatePropertyById = async (data, id) =>
  await axios.put(`/api/property/${id}`, data, { withCredentials: true });

export const myPropeties = async () =>
  await axios.get(`/api/property/my-properties`, { withCredentials: true });

export const deletePropertyById = async (id) =>
  await axios.delete(`/api/property/${id}`, { withCredentials: true });
