import api from "./api";
import type { bodyLog, createBodyLogType, updateBodyLogType } from "@/types/bodyType.ts";

export const getBodyLogs = async (): Promise<bodyLog[]> => {
  try {
    return (await api.get("/bodyLog")).data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const getBodyLogById = async (id: string): Promise<bodyLog | void> => {
  try {
    return (await api.get(`/bodyLog/${id}`)).data;
  } catch (error) {
    console.error(error);
  }
}

export const updateBodyLog = async (id: string, body: updateBodyLogType): Promise<bodyLog | void> => {
  try {
    return (await api.patch(`/bodyLog/${id}`, body)).data;
  } catch (error) {
    console.error(error);
  }
}

export const createBodyLog = async (body: createBodyLogType): Promise<bodyLog | void> => {
  try {
    return (await api.post("/bodyLog", body)).data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteBodyLog = async (id: string): Promise<void> => {
  try {
    await api.delete(`/bodyLog/${id}`);
  } catch (error) {
    console.error(error);
  }
}
