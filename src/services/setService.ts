import api from "./api";
import type { changeSetRequestType, createSetRequestType } from "@/types/setType.ts";

export const changeSetRequest = async (set: changeSetRequestType) => {
  return api.patch(`/set/changeSet/${set.id}`, set);
};

export const createSetRequest = async (set: createSetRequestType) => {
  return api.post("/set/createSet", set);
};

export const deleteSetRequest = async (setId: string) => {
  return api.delete(`/set/deleteSet/${setId}`);
};
