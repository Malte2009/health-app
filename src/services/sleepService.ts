import api from "./api";
import type { SleepLog, CreateSleepLog, UpdateSleepLog } from "@/types/sleepType";

export async function getSleepLogs(): Promise<SleepLog[]> {
  const response = await api.get("/sleep");
  return response.data;
}

export async function getSleepLog(id: string): Promise<SleepLog> {
  const response = await api.get(`/sleep/${id}`);
  return response.data;
}

export async function createSleepLog(data: CreateSleepLog): Promise<SleepLog> {
  const response = await api.post("/sleep", data);
  return response.data;
}

export async function updateSleepLog(id: string, data: UpdateSleepLog): Promise<SleepLog> {
  const response = await api.put(`/sleep/${id}`, data);
  return response.data;
}

export async function deleteSleepLog(id: string): Promise<void> {
  await api.delete(`/sleep/${id}`);
}

