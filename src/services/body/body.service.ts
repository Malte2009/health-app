import api from "@/services/api.ts";
import type { bodyLog, createBodyLogType, updateBodyLogType } from "@/types/bodyType.ts";

class BodyService {
  async getBodyLogs(): Promise<bodyLog[]> {
    return (await api.get("/bodyLog")).data;
  }

  async getBodyLogById(id: string): Promise<bodyLog> {
    return (await api.get(`/bodyLog/${id}`)).data;
  }

  async updateBodyLog(id: string, body: updateBodyLogType): Promise<bodyLog> {
    return (await api.patch(`/bodyLog/${id}`, body)).data;
  }

  async createBodyLog(body: createBodyLogType): Promise<bodyLog> {
    return (await api.post("/bodyLog", body)).data;
  }

  async deleteBodyLog(id: string): Promise<void> {
    await api.delete(`/bodyLog/${id}`);
  }
}

export default new BodyService();
