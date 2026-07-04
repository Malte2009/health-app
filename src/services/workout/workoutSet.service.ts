import api from "@/services/api.ts";
import type { createWorkoutSetType, updateWorkoutSetType, WorkoutSet } from "@/types/workout/workoutSet.type.ts";


class WorkoutSetService {
  getWorkoutSets = async (workoutId: string, workoutExerciseId: string): Promise<WorkoutSet[]> => {
    try {
      return (await api.get(`/workouts/${workoutId}/exercises/${workoutExerciseId}/sets`)).data;
    } catch {
      return [];
    }
  }
  getWorkoutSetById = async (workoutId: string, workoutExerciseId: string, setId: string): Promise<WorkoutSet | void> => {
    try {
      return (await api.get(`/workouts/${workoutId}/exercises/${workoutExerciseId}/sets/${setId}`)).data;
    } catch {
      return;
    }
  }
  getSetTypes = async (): Promise<string[]> => {
    try {
      return (await api.get("/sets/types")).data;
    } catch {
      return [];
    }
  }
  getSetUnits = async (): Promise<string[]> => {
    try {
      return (await api.get("/sets/units")).data;
    } catch {
      return [];
    }
  }
  createWorkoutSet = async (workoutId: string, workoutExerciseId: string, set: createWorkoutSetType): Promise<WorkoutSet | void> => {
    try {
      return (await api.post(`/workouts/${workoutId}/exercises/${workoutExerciseId}/sets`, set)).data;
    } catch {
      return;
    }
  }
  updateWorkoutSet = async (workoutId: string, workoutExerciseId: string, setId: string, set: updateWorkoutSetType): Promise<WorkoutSet | void> => {
    try {
      return (await api.patch(`/workouts/${workoutId}/exercises/${workoutExerciseId}/sets/${setId}`, set)).data;
    } catch {
      return;
    }
  }
  deleteWorkoutSet = async (workoutId: string, workoutExerciseId: string, setId: string): Promise<void> => {
    try {
      await api.delete(`/workouts/${workoutId}/exercises/${workoutExerciseId}/sets/${setId}`);
    } catch {
      return;
    }
  }
}


export default new WorkoutSetService();
