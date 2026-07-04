import api from "@/services/api.ts";
import type { bodyLog, createBodyLogType, updateBodyLogType } from "@/types/bodyType.ts";

class BodyService {
  async getBodyLogs(): Promise<bodyLog[]> {
    try {
      return (await api.get("/bodyLog")).data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getBodyLogById(id: string): Promise<bodyLog | void> {
    try {
      return (await api.get(`/bodyLog/${id}`)).data;
    } catch (error) {
      console.error(error);
    }
  }

  async updateBodyLog(id: string, body: updateBodyLogType): Promise<bodyLog | void> {
    try {
      return (await api.patch(`/bodyLog/${id}`, body)).data;
    } catch (error) {
      console.error(error);
    }
  }

  async createBodyLog(body: createBodyLogType): Promise<bodyLog | void> {
    try {
      return (await api.post("/bodyLog", body)).data;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteBodyLog(id: string): Promise<void> {
    try {
      await api.delete(`/bodyLog/${id}`);
    } catch (error) {
      console.error(error);
    }
  }
}

export default new BodyService();
