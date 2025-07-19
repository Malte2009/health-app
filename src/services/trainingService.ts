import api from "./api";
import type {
  createTrainingLogRequestType,
  getTrainingResponseType, training
} from "@/types/trainingType.ts";

export const getTrainings = async (): Promise<getTrainingResponseType[]> => {
  const response = await api.get("/training/getTraining");

  return response.data;
};

export const getTrainingById = async (id: string): Promise<getTrainingResponseType | null> => {
  const response = await api.get(`/training/getTraining/${id}`);
  return response.data;
};

export const getTrainingTypes = async (): Promise<string[]> => {
  const response = await api.get("/training/getTrainingTypes");
  return response.data;
};

export const updateTraining = async (id: string, training: training): Promise<training | null> => {
  const response = await api.patch(`/training/updateTraining/${id}`, training);
  return response.data;
};

export const createTrainingLog = async (training: createTrainingLogRequestType): Promise<training> => {
  const response = await api.post("/training/createTraining", training);
  return response.data;
};

export const deleteTrainingRequest = async (id: string): Promise<void> => {
  await api.delete(`/training/deleteTraining/${id}`);
};
