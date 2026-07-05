import api from "@/services/api.ts";
import type { createWorkoutExerciseType, updateWorkoutExerciseType, WorkoutExercise } from "@/types/workout/workoutExercise.type.ts";

class WorkoutExerciseService {
  getWorkoutExercises = async (workoutId: string, includeSets = true): Promise<WorkoutExercise[]> => {
    return (await api.get(`/workouts/${workoutId}/exercises`, { params: { includeSets } })).data
  }
  getWorkoutExerciseById = async (workoutId: string, exerciseId: string, includeSets = true): Promise<WorkoutExercise> => {
    return (await api.get(`/workouts/${workoutId}/exercises/${exerciseId}`, { params: { includeSets } })).data
  }
  createWorkoutExercise = async (workoutId: string, exercise: createWorkoutExerciseType): Promise<WorkoutExercise> => {
    return (await api.post(`/workouts/${workoutId}/exercises`, exercise)).data
  }
  updateWorkoutExercise = async (workoutId: string, exerciseId: string, exercise: updateWorkoutExerciseType): Promise<WorkoutExercise> => {
    return (await api.patch(`/workouts/${workoutId}/exercises/${exerciseId}`, exercise)).data
  }
  deleteWorkoutExercise = async (workoutId: string, exerciseId: string): Promise<void> => {
    await api.delete(`/workouts/${workoutId}/exercises/${exerciseId}`)
  }
}

export default new WorkoutExerciseService();
