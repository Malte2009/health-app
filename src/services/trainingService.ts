import api from "./api";
import type {
  createTrainingLogRequestType,
  getTrainingResponseType, training
} from "@/types/trainingType.ts";

export const getTrainings = async (): Promise<getTrainingResponseType[]> => {
  try {
    return (await api.get("/training")).data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getTrainingById = async (id: string): Promise<getTrainingResponseType | void> => {
  try {
    return (await api.get(`/training/${id}`)).data;
  } catch (error) {
    console.error(error);
  }
};

export const getTrainingNames= async (): Promise<string[]> => {
  try {
    return (await api.get("/training/names")).data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const updateTraining = async (id: string, training: training): Promise<training | void> => {
  try {
    return (await api.patch(`/training/${id}`, training)).data;
  } catch (error) {
    console.error(error);
  }
};

export const createTrainingLog = async (training: createTrainingLogRequestType): Promise<training | void> => {
  try {
    return (await api.post("/training", training)).data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteTrainingRequest = async (id: string): Promise<void> => {
  try {
    await api.delete(`/training/${id}`);
  } catch (error) {
    console.error(error);
  }
};
