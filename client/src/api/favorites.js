import axios from "axios";

export const getAlters = async () =>
  await axios.get(`/api/favorites`, {
    withCredentials: true,
  });

export const toggleFavoriteProperty = async (id) =>
  await axios.post(`/api/favorites`, { propertyId: id } , {
    withCredentials: true,
  });