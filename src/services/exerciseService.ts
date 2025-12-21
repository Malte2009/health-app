import api from "./api";
import type { exerciseType } from "@/types/exerciseType.ts";

export const getExerciseNames = async (): Promise<string[] | null> => {
  try {
    const response = await api.get("/exercise/getExerciseNames");
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getExerciseByName = async (name: string): Promise<exerciseType | null> => {
  try {
    const response = await api.get(`/exercise/getExercise/${name}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const createExercise = async (name: string): Promise<exerciseType | null> => {
  try {
    const response = await api.post("/exercise/createExercise", { name });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const changeExercise = async (name: string): Promise<exerciseType | null> => {
  try {
    const response = await api.patch(`/exercise/changeExercise/${name}`, { name });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const deleteExercise = async (name: string): Promise<void> => {
  try {
    await api.delete(`/exercise/deleteExercise/${name}`);
  } catch (error) {
    return;
  }
};
