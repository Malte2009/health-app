import api from "./api";
import type { createTrainingLogRequestType, getTrainingResponseType, training } from "@/types/trainingType.ts";
import { useTrainingStore } from "@/stores/training.ts";
import { useTypeStore } from "@/stores/type.ts";

export const getTrainings = async (): Promise<getTrainingResponseType[] | void> => {
  const trainingsStore = useTrainingStore();
  try {
    const trainings = (await api.get("/training/getTraining")).data;
    trainingsStore.setTrainings(trainings);
    return trainings;
  } catch (error) {
    console.error(error);
  }
};

export const getTrainingById = async (id: string): Promise<getTrainingResponseType | void> => {
  const trainingsStore = useTrainingStore();
  try {
    const training = (await api.get(`/training/getTraining/${id}`)).data;
    trainingsStore.updateTraining(id, training);
    return training;
  } catch (error) {
    console.error(error);
  }
};

export const getTrainingTypes = async (): Promise<string[] | void> => {
  const typeStore = useTypeStore();
  try {
    const trainingTypes = (await api.get("/training/getTrainingTypes")).data;
    typeStore.setTrainingTypes(trainingTypes);
    return trainingTypes;
  } catch (error) {
    console.error(error);
  }
};

export const updateTraining = async (id: string, training: training): Promise<training | void> => {
  const trainingsStore = useTrainingStore();
  try {
    const updatedTraining = (await api.patch(`/training/updateTraining/${id}`, training)).data;
    trainingsStore.updateTraining(id, updatedTraining);
    return updatedTraining;
  } catch (error) {
    console.error(error);
  }
};

export const createTrainingLog = async (training: createTrainingLogRequestType): Promise<training | void> => {
  const trainingsStore = useTrainingStore();
  try {
    const newTraining = (await api.post("/training/createTrainingLog", training)).data;
    trainingsStore.createTraining(newTraining);
    return newTraining;
  } catch (error) {
    console.error(error);
  }
};

export const deleteTrainingRequest = async (id: string): Promise<void> => {
  const trainingsStore = useTrainingStore();
  try {
    await api.delete(`/training/deleteTraining/${id}`);
    trainingsStore.deleteTraining(id);
  } catch (error) {
    console.error(error);
  }
};
