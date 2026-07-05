import api from "@/services/api.ts";
import type { NrvValues, NrvProgressResponse, NrvProgressRequest } from "@/types/foodType.ts";

class NrvService {
  async getNrv(): Promise<NrvValues> {
    return (await api.get("/nrv")).data;
  }

  async getNrvProgress(nutrientTotals: NrvProgressRequest["nutrientTotals"]): Promise<NrvProgressResponse> {
    const request: NrvProgressRequest = { nutrientTotals };
    return (await api.post("/nrv/progress", request)).data;
  }
}

export default new NrvService();
