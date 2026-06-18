import api from "@/services/api.ts";
import type { createWorkoutSetType, updateWorkoutSetType, WorkoutSet } from "@/types/workout/workoutSet.type.ts";


class WorkoutSetService {
  getWorkoutSets = async (workoutId: string, workoutExerciseId: string): Promise<WorkoutSet[]> => {
    try {
      return (await api.get(`/workouts/${workoutId}/exercises/${workoutExerciseId}/sets`)).data;
    } catch (error) {
      return [];
    }
  }
  getWorkoutSetById = async (workoutId: string, workoutExerciseId: string, setId: string): Promise<WorkoutSet | void> => {
    try {
      return (await api.get(`/workouts/${workoutId}/exercises/${workoutExerciseId}/sets/${setId}`)).data;
    } catch (error) {
      return;
    }
  }
  getSetTypes = async (): Promise<string[]> => {
    try {
      return (await api.get("/sets/types")).data;
    } catch (error) {
      return [];
    }
  }
  getSetUnits = async (): Promise<string[]> => {
    try {
      return (await api.get("/sets/units")).data;
    } catch (error) {
      return [];
    }
  }
  createWorkoutSet = async (workoutId: string, workoutExerciseId: string, set: createWorkoutSetType): Promise<WorkoutSet | void> => {
    try {
      return (await api.post(`/workouts/${workoutId}/exercises/${workoutExerciseId}/sets`, set)).data;
    } catch (error) {
      return;
    }
  }
  updateWorkoutSet = async (workoutId: string, workoutExerciseId: string, setId: string, set: updateWorkoutSetType): Promise<WorkoutSet | void> => {
    try {
      return (await api.patch(`/workouts/${workoutId}/exercises/${workoutExerciseId}/sets/${setId}`, set)).data;
    } catch (error) {
      return;
    }
  }
  deleteWorkoutSet = async (workoutId: string, workoutExerciseId: string, setId: string): Promise<void> => {
    try {
      await api.delete(`/workouts/${workoutId}/exercises/${workoutExerciseId}/sets/${setId}`);
    } catch (error) {
      return;
    }
  }
}


export default new WorkoutSetService();
