import api from "@/services/api.ts";
import type { CreateSymptomRequest, SymptomLog, UpdateSymptomRequest } from "@/types/symptoms/symptomType.ts";

class SymptomService {
  async getSymptoms(): Promise<SymptomLog[]> {
    return (await api.get("/symptoms/")).data;
  }

  async getSymptomById(id: string): Promise<SymptomLog> {
    return (await api.get(`/symptoms/${id}`)).data;
  }

  async createSymptom(symptomData: CreateSymptomRequest): Promise<SymptomLog> {
    return (await api.post("/symptoms", symptomData)).data;
  }

  async updateSymptom(symptomData: UpdateSymptomRequest): Promise<SymptomLog> {
    return (await api.patch(`/symptoms/${symptomData.id}`, symptomData)).data;
  }

  async deleteSymptom(id: string): Promise<unknown> {
    return (await api.delete(`/symptoms/${id}`)).data;
  }
}

export default new SymptomService();
