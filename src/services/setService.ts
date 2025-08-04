import api from "./api";
import type { changeSetRequestType, createSetRequestType, set } from "@/types/setType.ts";

export const getSetById = async (id: string): Promise<set | null> => {
  const response = await api.get(`/set/getSet/${id}`);
  return response.data;
};

export const getSetTypes = async (): Promise<string[]> => {
  const response = await api.get("/set/getSetTypes");
  return response.data;
};

export const getSetUnits = async (): Promise<string[]> => {
  const response = await api.get("/set/getSetUnits");
  return response.data;
};

export const changeSetRequest = async (set: changeSetRequestType): Promise<set | null> => {
  const response = await api.patch(`/set/changeSet/${set.id}`, set);
  return response.data;
};

export const createSetRequest = async (set: createSetRequestType): Promise<set | null> => {
  const response = await api.post("/set/createSet", set);
  return response.data;
};

export const deleteSetRequest = async (setId: string): Promise<void> => {
  const response = await api.delete(`/set/deleteSet/${setId}`);
  return response.data;
};
