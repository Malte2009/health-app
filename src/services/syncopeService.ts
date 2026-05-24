import api from './api'
import type { SyncopeLog } from "@/types/symptoms/syncopeType.ts";

export const syncopeService = {
 getSyncopes: async (): Promise<SyncopeLog[]> => {
    try {
      return (await api.get("/syncopes/")).data;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  async getSyncopeById(id: string): Promise<SyncopeLog | undefined> {
    try {
      return (await api.get(`/syncopes/${id}`)).data;
    } catch (error) {
      console.error(error);
    }
  },
  async createSyncope(syncopeData: SyncopeLog): Promise<SyncopeLog | undefined> {
    try {
      return (await api.post("/syncopes", syncopeData)).data;
    } catch (error) {
      console.error(error);
    }
  },
  async updateSyncope(syncopeData: SyncopeLog): Promise<SyncopeLog | undefined> {
    try {
      return (await api.patch(`/syncopes/${syncopeData.id}`, syncopeData)).data;
    } catch (error) {
      console.error(error);
    }
  },
  async deleteSyncope(id: string): Promise<void> {
    try {
      await api.delete(`/syncopes/${id}`);
    } catch (error) {
      console.error(error);
    }
  }
};

export default syncopeService;
