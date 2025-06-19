import api from "./api";
import type { createBodyLogRequest } from "@/types/bodyType.ts";

export const createBodyLog = async (body: createBodyLogRequest) => {
  return api.post("/bodyLogs", body);
};
