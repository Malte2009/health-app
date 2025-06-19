import api from "./api";
import type { createSetRequest } from "@/types/setType.ts";

export const createSet = async (set: createSetRequest) => {
  return api.post("/sets", set);
};
