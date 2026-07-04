import api from "@/services/api.ts";
import type { createWorkoutExerciseType, updateWorkoutExerciseType, WorkoutExercise } from "@/types/workout/workoutExercise.type.ts";

class WorkoutExerciseService {
  getWorkoutExercises = async (workoutId: string, includeSets = true): Promise<WorkoutExercise[]> => {
    try {
      return (await api.get(`/workouts/${workoutId}/exercises`, { params: { includeSets } })).data
    } catch {
      return []
    }
  }
  getWorkoutExerciseById = async (workoutId: string, exerciseId: string, includeSets = true): Promise<WorkoutExercise | void> => {
    try {
      return (await api.get(`/workouts/${workoutId}/exercises/${exerciseId}`, { params: { includeSets } })).data
    } catch {
      return
    }
  }
  createWorkoutExercise = async (workoutId: string, exercise: createWorkoutExerciseType): Promise<WorkoutExercise | void> => {
    try {
      return (await api.post(`/workouts/${workoutId}/exercises`, exercise)).data
    } catch {
      return
    }
  }
  updateWorkoutExercise = async (workoutId: string, exerciseId: string, exercise: updateWorkoutExerciseType): Promise<WorkoutExercise | void> => {
    try {
      return (await api.patch(`/workouts/${workoutId}/exercises/${exerciseId}`, exercise)).data
    } catch {
      return
    }
  }
  deleteWorkoutExercise = async (workoutId: string, exerciseId: string): Promise<void> => {
    try {
      await api.delete(`/workouts/${workoutId}/exercises/${exerciseId}`)
    } catch {
      return
    }
  }
}

export default new WorkoutExerciseService();
