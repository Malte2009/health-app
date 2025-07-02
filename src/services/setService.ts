import api from "./api";
import type { changeSetRequestType, createSetRequestType, getSetTypesResponseType, set } from "@/types/setType.ts";

export const getSetById = async (id: string): Promise<set> => {
  const response = await api.get(`/set/getSet/${id}`);
  return response.data;
};

export const getSetTypes = async (): Promise<getSetTypesResponseType> => {
  const response = await api.get("/set/getSetTypes");
  return response.data;
};

export const changeSetRequest = async (set: changeSetRequestType) => {
  return api.patch(`/set/changeSet/${set.id}`, set);
};

export const createSetRequest = async (set: createSetRequestType) => {
  return api.post("/set/createSet", set);
};

export const deleteSetRequest = async (setId: string) => {
  return api.delete(`/set/deleteSet/${setId}`);
};
