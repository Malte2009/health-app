import api from "./api";
import type { BloodPressureLog, CreateBloodPressureLog, UpdateBloodPressureLog } from "@/types/bloodPressureType";

export async function getBloodPressureLogs(): Promise<BloodPressureLog[]> {
  const response = await api.get("/blood-pressure");
  return response.data;
}

export async function getBloodPressureLog(id: string): Promise<BloodPressureLog> {
  const response = await api.get(`/blood-pressure/${id}`);
  return response.data;
}

export async function createBloodPressureLog(data: CreateBloodPressureLog): Promise<BloodPressureLog> {
  const response = await api.post("/blood-pressure", data);
  return response.data;
}

export async function updateBloodPressureLog(id: string, data: UpdateBloodPressureLog): Promise<BloodPressureLog> {
  const response = await api.put(`/blood-pressure/${id}`, data);
  return response.data;
}

export async function deleteBloodPressureLog(id: string): Promise<void> {
  await api.delete(`/blood-pressure/${id}`);
}

