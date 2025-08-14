import api from "./api";
import type { addExerciseToTrainingRequest, changeExerciseInTrainingRequest, exercise } from "@/types/exerciseType.ts";
import { useTypeStore } from "@/stores/type.ts";

export const getExerciseNames = async (): Promise<string[] | void> => {
  const typeStore = useTypeStore();
  try {
    const exerciseNames = (await api.get("/exercise/getExerciseNames")).data;
    typeStore.setExerciseTypes(exerciseNames);
    return exerciseNames;
  } catch (error) {
    console.error(error);
  }
};

export const getExerciseById = async (id: string): Promise<exercise | void> => {
  try {
    return (await api.get(`/exercise/${id}`)).data;
  } catch (error) {
    console.error(error);
  }
};

export const changeExerciseInTraining = async (exercise: changeExerciseInTrainingRequest): Promise<exercise | void> => {
  try {
    return (await api.patch(`/exercise/changeExerciseInTraining/${exercise.id}`, exercise)).data;
  } catch (error) {
    console.error(error);
  }
};

export const addExerciseToTraining = async (exercise: addExerciseToTrainingRequest): Promise<exercise | void> => {
  try {
    return (await api.post("/exercise/addExerciseToTraining", exercise)).data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteExerciseFromTraining = async (id: string): Promise<void> => {
  try {
    await api.delete(`/exercise/deleteExercise/${id}`);
  } catch (error) {
    console.error(error);
  }
};
