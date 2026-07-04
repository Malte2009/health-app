import api from "@/services/api.ts";
import type { BloodPressureLog, CreateBloodPressureLog, UpdateBloodPressureLog } from "@/types/bloodPressureType";

class BloodPressureService {
  async getBloodPressureLogs(): Promise<BloodPressureLog[]> {
    const response = await api.get("/blood-pressure");
    return response.data;
  }

  async getBloodPressureLog(id: string): Promise<BloodPressureLog> {
    const response = await api.get(`/blood-pressure/${id}`);
    return response.data;
  }

  async createBloodPressureLog(data: CreateBloodPressureLog): Promise<BloodPressureLog> {
    const response = await api.post("/blood-pressure", data);
    return response.data;
  }

  async updateBloodPressureLog(id: string, data: UpdateBloodPressureLog): Promise<BloodPressureLog> {
    const response = await api.put(`/blood-pressure/${id}`, data);
    return response.data;
  }

  async deleteBloodPressureLog(id: string): Promise<void> {
    await api.delete(`/blood-pressure/${id}`);
  }
}

export default new BloodPressureService();
