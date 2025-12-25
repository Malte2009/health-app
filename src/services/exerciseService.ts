import api from "./api";
import type { exerciseType } from "@/types/exerciseType.ts";

export const getExerciseNames = async (): Promise<string[] | void> => {
  try {
    return (await api.get("/exercise/getExerciseNames")).data;
  } catch (error) {
    return;
  }
};

export const getExerciseByName = async (name: string): Promise<exerciseType | void> => {
  try {
    return (await api.get(`/exercise/getExercise/${name}`)).data;
  } catch (error) {
    return;
  }
};

export const createExercise = async (name: string): Promise<exerciseType | void> => {
  try {
    return (await api.post("/exercise/createExercise", { name })).data;
  } catch (error) {
    return;
  }
};

export const changeExercise = async (oldName: string, newName: string): Promise<exerciseType | void> => {
  try {
    return (await api.patch(`/exercise/changeExercise/${oldName}`, { name: newName })).data;
  } catch (error) {
    return;
  }
};

export const deleteExercise = async (name: string): Promise<void> => {
  try {
    await api.delete(`/exercise/deleteExercise/${name}`);
  } catch (error) {
    return;
  }
};
