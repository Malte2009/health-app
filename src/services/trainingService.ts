import api from "./api";
import type { createWorkoutRequest, getTrainingResponseType, getWorkoutResponse, training } from "@/types/trainingType.ts";

function normalizeWorkout(workout: getWorkoutResponse): getTrainingResponseType {
  const workoutExercises = workout.workoutExercises ?? [];
  return {
    ...workout,
    type: workout.type ?? "",
    exerciseLogs: workoutExercises.map((workoutExercise) => ({
      ...workoutExercise,
      trainingId: workoutExercise.workoutId,
      sets: (workoutExercise.sets ?? []).map((set) => ({
        ...set,
        exerciseLogId: set.workoutExerciseId,
      })),
    })),
  };
}

class WorkoutService {
  async getWorkouts(): Promise<getTrainingResponseType[]> {
    try {
      return ((await api.get("/workouts")).data as getWorkoutResponse[]).map(normalizeWorkout);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getWorkoutById(workoutId: string): Promise<getTrainingResponseType | void> {
    try {
      return normalizeWorkout((await api.get(`/workouts/${workoutId}`)).data);
    } catch (error) {
      console.error(error);
    }
  }

  async getWorkoutNames(): Promise<string[]> {
    try {
      return (await api.get("/workouts/names")).data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createWorkout(workout: createWorkoutRequest): Promise<training | void> {
    try {
      return normalizeWorkout((await api.post("/workouts", workout)).data);
    } catch (error) {
      console.error(error);
    }
  }

  async updateWorkout(workoutId: string, workout: Partial<createWorkoutRequest>): Promise<training | void> {
    try {
      return normalizeWorkout((await api.patch(`/workouts/${workoutId}`, workout)).data);
    } catch (error) {
      console.error(error);
    }
  }

  async deleteWorkout(workoutId: string): Promise<void> {
    try {
      await api.delete(`/workouts/${workoutId}`);
    } catch (error) {
      console.error(error);
    }
  }
}

const workoutService = new WorkoutService();

export default workoutService;
