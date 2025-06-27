import api from "./api";
import type {
  createTrainingLogRequestType,
  createTrainingResponseType,
  getTrainingResponseType,
  getTrainingTypesResponseType,
  updateTrainingLogRequestType,
} from "@/types/trainingType.ts";

export const getTrainings = async (): Promise<getTrainingResponseType[]> => {
  const response = await api.get("/training/getTraining");

  return response.data;
};

export const getTrainingById = async (id: string): Promise<getTrainingResponseType | null> => {
  const response = await api.get(`/training/getTraining/${id}`);
  return response.data;
};

export const getTrainingTypes = async (): Promise<getTrainingTypesResponseType> => {
  const response = await api.get("/training/getTrainingTypes");
  return response.data;
};

export const updateTraining = (id: string, training: updateTrainingLogRequestType) => {
  return api.patch(`/training/training/${id}`, training);
};

export const createTrainingLog = async (training: createTrainingLogRequestType): Promise<createTrainingResponseType> => {
  const response = await api.post("/training/createTraining", training);
  return response.data;
};

export const deleteTrainingRequest = async (id: string): Promise<void> => {
  await api.delete(`/training/deleteTraining/${id}`);
};
