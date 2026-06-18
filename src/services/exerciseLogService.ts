import api from "./api";
import type {
  changeWorkoutExerciseRequest,
  createWorkoutExerciseRequest,
  exerciseLog,
  workoutExercise,
} from "@/types/exerciseLogType.ts";

function normalizeWorkoutExercise(workoutExercise: workoutExercise): exerciseLog {
  return {
    ...workoutExercise,
    trainingId: workoutExercise.workoutId,
    sets: (workoutExercise.sets ?? []).map((set) => ({
      ...set,
      exerciseLogId: set.workoutExerciseId,
    })),
  };
}

class WorkoutExerciseService {
  async getWorkoutExerciseById(workoutId: string, workoutExerciseId: string, includeSets = true): Promise<exerciseLog | void> {
    try {
      return normalizeWorkoutExercise(
        (await api.get(`/workouts/${workoutId}/exercises/${workoutExerciseId}`, {
          params: includeSets ? { includeSets: "true" } : undefined,
        })).data,
      );
    } catch (error) {
      console.error(error);
    }
  }

  async createWorkoutExercise(workoutId: string, workoutExercise: createWorkoutExerciseRequest): Promise<exerciseLog | void> {
    try {
      return normalizeWorkoutExercise((await api.post(`/workouts/${workoutId}/exercises`, workoutExercise)).data);
    } catch (error) {
      console.error(error);
    }
  }

  async changeWorkoutExercise(workoutExercise: changeWorkoutExerciseRequest): Promise<exerciseLog | void> {
    const { id, workoutId, newWorkoutId, ...body } = workoutExercise;

    try {
      return normalizeWorkoutExercise(
        (await api.patch(`/workouts/${workoutId}/exercises/${id}`, {
          ...body,
          workoutId: newWorkoutId,
        })).data,
      );
    } catch (error) {
      console.error(error);
    }
  }

  async deleteWorkoutExercise(workoutId: string, workoutExerciseId: string): Promise<void> {
    try {
      await api.delete(`/workouts/${workoutId}/exercises/${workoutExerciseId}`);
    } catch (error) {
      console.error(error);
    }
  }
}

const workoutExerciseService = new WorkoutExerciseService();

export default workoutExerciseService;
