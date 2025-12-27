import api from "./api";
import type { changeSetRequestType, createSetRequestType, set } from "@/types/setType.ts";

export const getSetById = async (id: string): Promise<set | void> => {
  try {
    return (await api.get(`/set/getSet/${id}`)).data;
  } catch (error) {
    console.error(error);
  }
};

export const getSetTypes = async (): Promise<string[]> => {
  try {
    return (await api.get("/set/getSetTypes")).data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getSetUnits = async (): Promise<string[]> => {
  try {
    return (await api.get("/set/getSetUnits")).data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const changeSetRequest = async (set: changeSetRequestType): Promise<set | void> => {
  try {
    return (await api.patch(`/set/changeSet/${set.id}`, set)).data;
  } catch (error) {
    console.error(error);
  }
};

export const createSetRequest = async (set: createSetRequestType): Promise<set | void> => {
  try {
    return (await api.post("/set/createSet", set)).data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteSetRequest = async (setId: string): Promise<void> => {
  try {
    await api.delete(`/set/deleteSet/${setId}`);
  } catch (error) {
    console.error(error);
  }
};
