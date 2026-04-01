import api from "./api";
import type { NrvValues, NrvProgressResponse } from "@/types/foodType.ts";

export const getNrv = async (): Promise<NrvValues | void> => {
  try {
    return (await api.get("/nrv")).data;
  } catch (error) {
    console.error(error);
  }
};

export const getNrvProgress = async (nutrientTotals: Record<string, number>): Promise<NrvProgressResponse | void> => {
  try {
    return (await api.post("/nrv/progress", { nutrientTotals })).data;
  } catch (error) {
    console.error(error);
  }
};
