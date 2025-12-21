import api from "./api";
import type { changeExerciseLogRequest, createExerciseLogRequest, exerciseLog } from "@/types/exerciseLogType.ts";

export const getExerciseLogById = async (id: string): Promise<exerciseLog | null> => {
  try {
    const response = await api.get(`/exerciseLog/getExerciseLog/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const changeExerciseLog = async (exercise: changeExerciseLogRequest): Promise<exerciseLog | null> => {
  try {
    const response = await api.patch(`/exerciseLog/changeExerciseLog/${exercise.id}`, exercise);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const createExerciseLog = async (exercise: createExerciseLogRequest): Promise<exerciseLog | null> => {
  try {
    const response = await api.post("/exerciseLog/createExerciseLog", exercise);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const deleteExerciseLogRequest = async (id: string): Promise<void> => {
  try {
    await api.delete(`/exerciseLog/deleteExerciseLog/${id}`);
  } catch (error) {
    return;
  }
};
