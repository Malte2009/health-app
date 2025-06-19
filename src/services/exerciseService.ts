import api from './api';
import type {createExerciseLogRequest} from "@/types/exerciseType.ts";

export const createExerciseLog = async (exercise: createExerciseLogRequest) => {
  return api.post('/exerciseLogs', exercise);
}
