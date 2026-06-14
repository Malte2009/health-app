import api from "./api";
import type { exerciseType } from "@/types/exerciseType.ts";

export const getExercises = async (): Promise<exerciseType[] | void> => {
  try {
    return (await api.get("/exercise")).data;
  } catch (error) {
    console.error(error);
  }
};

export const getExerciseNames = async (): Promise<string[] | void> => {
  try {
    return (await api.get("/exercise/names")).data;
  } catch (error) {
    console.error(error);
  }
};

export const getExerciseByName = async (name: string): Promise<exerciseType | void> => {
  try {
    return (await api.get(`/exercise/${name}`)).data;
  } catch (error) {
    console.error(error);
  }
};

export const createExercise = async (name: string): Promise<exerciseType | void> => {
  try {
    return (await api.post("/exercise", { name })).data;
  } catch (error) {
    console.error(error);
  }
};

export const updateExercise = async (oldName: string, newName: string): Promise<exerciseType | void> => {
  try {
    return (await api.patch(`/exercise/${oldName}`, { name: newName })).data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteExercise = async (name: string): Promise<void> => {
  try {
    await api.delete(`/exercise/${name}`);
  } catch (error) {
    console.error(error);
  }
};
