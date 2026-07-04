import api from "../api.ts";
import type { createWorkoutType, updateWorkoutType, Workout } from "@/types/workout/workout.type.ts";

class WorkoutService {
  async getWorkouts(includeExercises: boolean = false, includeSets: boolean = false): Promise<Workout[]> {
    try {
      return (await api.get(`/workouts?includeExercises=${includeExercises}&includeSets=${includeSets}`)).data;
    } catch {
      return [];
    }
  }

  async getWorkoutById(workoutId: string, includeExercises: boolean = true, includeSets: boolean = true): Promise<Workout | void> {
    try {
      return (await api.get(`/workouts/${workoutId}?includeExercises=${includeExercises}&includeSets=${includeSets}`)).data;
    } catch {
      return;
    }
  }

  async getWorkoutNames(): Promise<string[]> {
    try {
      return (await api.get("/workouts/names")).data;
    } catch {
      return [];
    }
  }

  async createWorkout(workout: createWorkoutType): Promise<Workout | void> {
    try {
      return (await api.post("/workouts", workout)).data;
    } catch {
      return;
    }
  }

  async updateWorkout(workoutId: string, workout: updateWorkoutType): Promise<Workout | void> {
    try {
      return (await api.patch(`/workouts/${workoutId}`, workout)).data;
    } catch {
      return;
    }
  }

  async deleteWorkout(workoutId: string): Promise<void> {
    try {
      await api.delete(`/workouts/${workoutId}`);
    } catch {
      return;
    }
  }
}

const workoutService = new WorkoutService();

export default workoutService;
