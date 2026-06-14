import api from "./api";
import type { changeExerciseLogRequest, createExerciseLogRequest, exerciseLog } from "@/types/exerciseLogType.ts";

export const getExerciseLogById = async (id: string): Promise<exerciseLog | void> => {
  try {
    return (await api.get(`/exerciseLog/${id}`)).data;
  } catch (error) {
    console.error(error);
  }
};

export const changeExerciseLog = async (exercise: changeExerciseLogRequest): Promise<exerciseLog | void> => {
  try {
    return (await api.patch(`/exerciseLog/${exercise.id}`, exercise)).data;
  } catch (error) {
    console.error(error);
  }
};

export const createExerciseLog = async (exercise: createExerciseLogRequest): Promise<exerciseLog | void> => {
  try {
    return (await api.post("/exerciseLog", exercise)).data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteExerciseLogRequest = async (id: string): Promise<void> => {
  try {
    await api.delete(`/exerciseLog/${id}`);
  } catch (error) {
    console.error(error);
  }
};
