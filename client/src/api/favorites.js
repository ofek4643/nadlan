import api from "./api";

export const getAlters = async () => await api.get(`/favorites`);

export const toggleFavoriteProperty = async (id) =>
  await api.post(`/favorites`, { propertyId: id });
