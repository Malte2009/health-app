import api from "./api";
import type { createBodyLogRequest } from "@/types/bodyType.ts";

export const createBodyLog = async (body: createBodyLogRequest) => {
  try {
    return (await api.post("/bodyLogs", body)).data;
  } catch (error) {
    return;
  }
};
