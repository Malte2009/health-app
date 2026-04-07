import api from "./api";
import type {
  createTrainingLogRequestType,
  getTrainingResponseType, trainingLog
} from "@/types/trainingType.ts";

export const getTrainingLogs = async (): Promise<trainingLog[]> => {
  try {
    return (await api.get("/training/getTrainingLogs")).data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const getTrainingLogsWithExercises = async (): Promise<getTrainingResponseType[]> => {
  try {
    return (await api.get("/training/getTrainingLogsWithExercises")).data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getTrainingLogById = async (id: string): Promise<trainingLog | void> => {
  try {
    return (await api.get(`/training/getTraining/${id}`)).data;
  } catch (error) {
    console.error(error);
  }
};

export const getTrainingLogNames= async (): Promise<string[]> => {
  try {
    return (await api.get("/training/getTrainingNames")).data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const updateTrainingLog = async (id: string, training: trainingLog): Promise<trainingLog | void> => {
  try {
    return (await api.patch(`/training/updateTraining/${id}`, training)).data;
  } catch (error) {
    console.error(error);
  }
};

export const createTrainingLog = async (training: createTrainingLogRequestType): Promise<trainingLog | void> => {
  try {
    return (await api.post("/training/createTraining", training)).data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteTrainingLog = async (id: string): Promise<void> => {
  try {
    await api.delete(`/training/deleteTraining/${id}`);
  } catch (error) {
    console.error(error);
  }
};
