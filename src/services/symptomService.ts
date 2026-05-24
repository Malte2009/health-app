import api from "./api";
import type { SymptomLog } from "@/types/symptoms/symptomType.ts";

export const symptomService = {
    getSymptoms: async (): Promise<SymptomLog[]> => {
      try {
        return (await api.get("/symptoms/")).data;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
   getSymptomById: async (id: string) => {
      try {
        return (await api.get(`/symptoms/${id}`)).data;
      } catch (error) {
        console.error(error);
      }
   },
    createSymptom: async (symptomData: SymptomLog) => {
      try {
        return (await api.post("/symptoms", symptomData)).data;
      } catch (error) {
        console.error(error);
      }
    },
    updateSymptom: async (symptomData: SymptomLog) => {
      try {
        return (await api.patch(`/symptoms/${symptomData.id}`, symptomData)).data;
      } catch (error) {
        console.error(error);
      }
  },
  deleteSymptom: async (id: string) => {
      try {
        return (await api.delete(`/symptoms/${id}`)).data;
      } catch (error) {
        console.error(error);
      }
  }
}

export default symptomService;
