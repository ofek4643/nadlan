import { api } from "./api";

export const getAlerts = async () => await api.get("/api/favorites");

export const toggleFavoriteProperty = async (id) =>
  await api.post("/api/favorites", { propertyId: id });
