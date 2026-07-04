import api from "@/services/api.ts";
import type { SleepLog, CreateSleepLog, UpdateSleepLog } from "@/types/sleepType";

class SleepService {
  async getSleepLogs(): Promise<SleepLog[]> {
    const response = await api.get("/sleep");
    return response.data;
  }

  async getSleepLog(id: string): Promise<SleepLog> {
    const response = await api.get(`/sleep/${id}`);
    return response.data;
  }

  async createSleepLog(data: CreateSleepLog): Promise<SleepLog> {
    const response = await api.post("/sleep", data);
    return response.data;
  }

  async updateSleepLog(id: string, data: UpdateSleepLog): Promise<SleepLog> {
    const response = await api.put(`/sleep/${id}`, data);
    return response.data;
  }

  async deleteSleepLog(id: string): Promise<void> {
    await api.delete(`/sleep/${id}`);
  }
}

export default new SleepService();
