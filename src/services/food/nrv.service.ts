import api from "@/services/api.ts";
import type { NrvValues, NrvProgressResponse, NrvProgressRequest } from "@/types/foodType.ts";

class NrvService {
  async getNrv(): Promise<NrvValues | void> {
    try {
      return (await api.get("/nrv")).data;
    } catch (error) {
      console.error(error);
    }
  }

  async getNrvProgress(nutrientTotals: NrvProgressRequest["nutrientTotals"]): Promise<NrvProgressResponse | void> {
    try {
      const request: NrvProgressRequest = { nutrientTotals };
      return (await api.post("/nrv/progress", request)).data;
    } catch (error) {
      console.error(error);
    }
  }
}

export default new NrvService();
