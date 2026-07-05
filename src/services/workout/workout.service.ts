import api from "../api.ts";
import type { createWorkoutType, updateWorkoutType, Workout } from "@/types/workout/workout.type.ts";

class WorkoutService {
  async getWorkouts(includeExercises: boolean = false, includeSets: boolean = false): Promise<Workout[]> {
    return (await api.get(`/workouts?includeExercises=${includeExercises}&includeSets=${includeSets}`)).data;
  }

  async getWorkoutById(workoutId: string, includeExercises: boolean = true, includeSets: boolean = true): Promise<Workout> {
    return (await api.get(`/workouts/${workoutId}?includeExercises=${includeExercises}&includeSets=${includeSets}`)).data;
  }

  async getWorkoutNames(): Promise<string[]> {
    return (await api.get("/workouts/names")).data;
  }

  async createWorkout(workout: createWorkoutType): Promise<Workout> {
    return (await api.post("/workouts", workout)).data;
  }

  async updateWorkout(workoutId: string, workout: updateWorkoutType): Promise<Workout> {
    return (await api.patch(`/workouts/${workoutId}`, workout)).data;
  }

  async deleteWorkout(workoutId: string): Promise<void> {
    await api.delete(`/workouts/${workoutId}`);
  }
}

const workoutService = new WorkoutService();

export default workoutService;
