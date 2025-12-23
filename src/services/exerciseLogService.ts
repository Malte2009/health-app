import api from "./api";
import type { changeExerciseLogRequest, createExerciseLogRequest, exerciseLog } from "@/types/exerciseLogType.ts";

export const getExerciseLogById = async (id: string): Promise<exerciseLog | void> => {
  try {
    return (await api.get(`/exerciseLog/getExerciseLog/${id}`)).data;
  } catch (error) {
    return;
  }
};

export const changeExerciseLog = async (exercise: changeExerciseLogRequest): Promise<exerciseLog | void> => {
  try {
    return (await api.patch(`/exerciseLog/changeExerciseLog/${exercise.id}`, exercise)).data;
  } catch (error) {
    return;
  }
};

export const createExerciseLog = async (exercise: createExerciseLogRequest): Promise<exerciseLog | void> => {
  try {
    return (await api.post("/exerciseLog/createExerciseLog", exercise)).data;
  } catch (error) {
    return;
  }
};

export const deleteExerciseLogRequest = async (id: string): Promise<void> => {
  try {
    await api.delete(`/exerciseLog/deleteExerciseLog/${id}`);
  } catch (error) {
    return;
  }
};
