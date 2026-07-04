import api from "@/services/api.ts";
import type { CreateSyncopeRequest, SyncopeLog, UpdateSyncopeRequest } from "@/types/symptoms/syncopeType.ts";

class SyncopeService {
  async getSyncopes(): Promise<SyncopeLog[]> {
     try {
       return (await api.get("/syncopes/")).data;
     } catch (error) {
       console.error(error);
       return [];
     }
   }

  async getSyncopeById(id: string): Promise<SyncopeLog | undefined> {
    try {
      return (await api.get(`/syncopes/${id}`)).data;
    } catch (error) {
      console.error(error);
    }
  }

  async createSyncope(syncopeData: CreateSyncopeRequest): Promise<SyncopeLog | undefined> {
    try {
      return (await api.post("/syncopes", syncopeData)).data;
    } catch (error) {
      console.error(error);
    }
  }

  async updateSyncope(syncopeData: UpdateSyncopeRequest): Promise<SyncopeLog | undefined> {
    try {
      return (await api.patch(`/syncopes/${syncopeData.id}`, syncopeData)).data;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteSyncope(id: string): Promise<void> {
    try {
      await api.delete(`/syncopes/${id}`);
    } catch (error) {
      console.error(error);
    }
  }
}

export default new SyncopeService();
