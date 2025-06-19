import api from "./api";
import type { createTrainingLogRequest, updateTrainingLogRequest } from "@/types/trainingType.ts";

export const createTrainingLog = (training: createTrainingLogRequest) => {
  return api.post("/trainingLogs", training);
};

export const updateTrainingLog = (id: string, training: updateTrainingLogRequest) => {
  return api.patch(`/trainingLogs/${id}`, training);
};

export const getTrainings = () => {
  return api.get("/trainingLogs");
};

export const getTrainingById = (id: string) => {
  return api.get(`/trainingLogs/${id}`);
};
