import api from "./api";
import type {
  createTrainingLogRequest,
  createTrainingResponse,
  getTrainingResponse,
  updateTrainingLogRequest,
} from "@/types/trainingType.ts";

export const createTrainingLog = async (
  training: createTrainingLogRequest,
): Promise<createTrainingResponse> => {
  const response = await api.post("/training/createTraining", training);
  return response.data;
};

export const updateTraining = (id: string, training: updateTrainingLogRequest) => {
  return api.patch(`/training/trainingLogs/${id}`, training);
};

export const getTrainings = (): Promise<getTrainingResponse> => {
  return api.get("/training/trainingLogs");
};

export const getTrainingById = async (id: string): Promise<getTrainingResponse | null> => {
  const response = await api.get(`/training/getTrainingLog/${id}`);
  return response.data;
};
