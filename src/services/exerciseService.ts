import api from "./api";
import type {
  changeExerciseRequest,
  changeExerciseResponse,
  createExerciseLogRequest,
  createExerciseLogResponse,
  exercise,
  getExerciseNamesType,
} from "@/types/exerciseType.ts";

export const getExerciseNames = async (): Promise<getExerciseNamesType> => {
  const response = await api.get("/exercise/getExerciseNames");
  return response.data;
};

export const getExerciseById = async (id: string): Promise<exercise | null> => {
  const response = await api.get(`/exercise/getExercise/${id}`);
  return response.data;
};

export const changeExercise = async (exercise: changeExerciseRequest): Promise<changeExerciseResponse> => {
  const response = await api.patch(`/exercise/changeExercise/${exercise.id}`, exercise);
  return response.data;
};

export const createExercise = async (exercise: createExerciseLogRequest): Promise<createExerciseLogResponse> => {
  const response = await api.post("/exercise/createExercise", exercise);
  return response.data;
};

export const deleteExerciseRequest = async (id: string): Promise<void> => {
  await api.delete(`/exercise/deleteExercise/${id}`);
};
