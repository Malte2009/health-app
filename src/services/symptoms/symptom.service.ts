import api from "@/services/api.ts";
import type { CreateSymptomRequest, SymptomLog, UpdateSymptomRequest } from "@/types/symptoms/symptomType.ts";

class SymptomService {
  async getSymptoms(): Promise<SymptomLog[]> {
    try {
      return (await api.get("/symptoms/")).data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getSymptomById(id: string): Promise<SymptomLog | void> {
    try {
      return (await api.get(`/symptoms/${id}`)).data;
    } catch (error) {
      console.error(error);
    }
  }

  async createSymptom(symptomData: CreateSymptomRequest): Promise<SymptomLog | void> {
    try {
      return (await api.post("/symptoms", symptomData)).data;
    } catch (error) {
      console.error(error);
    }
  }

  async updateSymptom(symptomData: UpdateSymptomRequest): Promise<SymptomLog | void> {
    try {
      return (await api.patch(`/symptoms/${symptomData.id}`, symptomData)).data;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteSymptom(id: string): Promise<unknown> {
    try {
      return (await api.delete(`/symptoms/${id}`)).data;
    } catch (error) {
      console.error(error);
    }
  }
}

export default new SymptomService();
