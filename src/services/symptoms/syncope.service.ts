import api from "@/services/api.ts";
import type { CreateSyncopeRequest, SyncopeLog, UpdateSyncopeRequest } from "@/types/symptoms/syncopeType.ts";

class SyncopeService {
  async getSyncopes(): Promise<SyncopeLog[]> {
     return (await api.get("/syncopes/")).data;
   }

  async getSyncopeById(id: string): Promise<SyncopeLog> {
    return (await api.get(`/syncopes/${id}`)).data;
  }

  async createSyncope(syncopeData: CreateSyncopeRequest): Promise<SyncopeLog> {
    return (await api.post("/syncopes", syncopeData)).data;
  }

  async updateSyncope(syncopeData: UpdateSyncopeRequest): Promise<SyncopeLog> {
    return (await api.patch(`/syncopes/${syncopeData.id}`, syncopeData)).data;
  }

  async deleteSyncope(id: string): Promise<void> {
    await api.delete(`/syncopes/${id}`);
  }
}

export default new SyncopeService();
