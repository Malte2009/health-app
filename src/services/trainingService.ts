import api from "./api";
import type {
  createTrainingLogRequestType,
  getTrainingResponseType, training
} from "@/types/trainingType.ts";

export const getTrainings = async (): Promise<getTrainingResponseType[]> => {
  try {
    return (await api.get("/training/getTraining")).data;
  } catch (error) {
    return [];
  }
};

export const getTrainingById = async (id: string): Promise<getTrainingResponseType | void> => {
  try {
    return (await api.get(`/training/getTraining/${id}`)).data;
  } catch (error) {
    return;
  }
};

export const getTrainingTypes = async (): Promise<string[]> => {
  try {
    return (await api.get("/training/getTrainingTypes")).data;
  } catch (error) {
    return [];
  }
};

export const updateTraining = async (id: string, training: training): Promise<training | void> => {
  try {
    return (await api.patch(`/training/updateTraining/${id}`, training)).data;
  } catch (error) {
    return;
  }
};

export const createTrainingLog = async (training: createTrainingLogRequestType): Promise<training | void> => {
  try {
    return (await api.post("/training/createTraining", training)).data;
  } catch (error) {
    return;
  }
};

export const deleteTrainingRequest = async (id: string): Promise<void> => {
  try {
    await api.delete(`/training/deleteTraining/${id}`);
  } catch (error) {
    return;
  }
};
