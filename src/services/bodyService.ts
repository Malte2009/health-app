import api from "./api";
import type { bodyLog, createBodyLogType, updateBodyLogType } from "@/types/bodyType.ts";

export const getBodyLogs = async (): Promise<bodyLog[]> => {
  try {
    return (await api.get("/bodyLog/getBodyLogs")).data;
  } catch (error) {
    return [];
  }
}

export const getBodyLogById = async (id: string): Promise<bodyLog | void> => {
  try {
    return (await api.get(`/bodyLog/getBodyLog/${id}`)).data;
  } catch (error) {
    return;
  }
}

export const updateBodyLog = async (id: string, body: updateBodyLogType): Promise<bodyLog | void> => {
  try {
    return (await api.patch(`/bodyLog/updateBodyLog/${id}`, body)).data;
  } catch (error) {
    return;
  }
}

export const createBodyLog = async (body: createBodyLogType): Promise<bodyLog | void> => {
  try {
    return (await api.post("/bodyLog/createBodyLog", body)).data;
  } catch (error) {
    return;
  }
};

export const deleteBodyLog = async (id: string): Promise<void> => {
  try {
    await api.delete(`/bodyLog/deleteBodyLog/${id}`);
  } catch (error) {
    return;
  }
}
