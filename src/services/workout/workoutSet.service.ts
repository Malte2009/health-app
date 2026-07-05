import api from "@/services/api.ts";
import type { createWorkoutSetType, updateWorkoutSetType, WorkoutSet } from "@/types/workout/workoutSet.type.ts";


class WorkoutSetService {
  getWorkoutSets = async (workoutId: string, workoutExerciseId: string): Promise<WorkoutSet[]> => {
    return (await api.get(`/workouts/${workoutId}/exercises/${workoutExerciseId}/sets`)).data;
  }
  getWorkoutSetById = async (workoutId: string, workoutExerciseId: string, setId: string): Promise<WorkoutSet> => {
    return (await api.get(`/workouts/${workoutId}/exercises/${workoutExerciseId}/sets/${setId}`)).data;
  }
  getSetTypes = async (): Promise<string[]> => {
    return (await api.get("/sets/types")).data;
  }
  getSetUnits = async (): Promise<string[]> => {
    return (await api.get("/sets/units")).data;
  }
  createWorkoutSet = async (workoutId: string, workoutExerciseId: string, set: createWorkoutSetType): Promise<WorkoutSet> => {
    return (await api.post(`/workouts/${workoutId}/exercises/${workoutExerciseId}/sets`, set)).data;
  }
  updateWorkoutSet = async (workoutId: string, workoutExerciseId: string, setId: string, set: updateWorkoutSetType): Promise<WorkoutSet> => {
    return (await api.patch(`/workouts/${workoutId}/exercises/${workoutExerciseId}/sets/${setId}`, set)).data;
  }
  deleteWorkoutSet = async (workoutId: string, workoutExerciseId: string, setId: string): Promise<void> => {
    await api.delete(`/workouts/${workoutId}/exercises/${workoutExerciseId}/sets/${setId}`);
  }
}


export default new WorkoutSetService();
