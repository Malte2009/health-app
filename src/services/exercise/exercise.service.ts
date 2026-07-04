import api from "@/services/api.ts";
import type { Exercise } from "@/types/exerciseType.ts";

class ExerciseService {
  async getAllExercises(): Promise<Exercise[]> {
    return (await api.get("/exercise")).data;
  }

  async getExerciseNames(): Promise<string[]> {
    return (await api.get("/exercise/names")).data;
  }

  async getExerciseById(id: string, includeWorkoutExercises: boolean = true): Promise<Exercise> {
    return (await api.get(`/exercise/${id}?includeWorkoutExercises=${includeWorkoutExercises}`)).data;
  }

  async createExercise(name: string): Promise<Exercise> {
    return (await api.post("/exercise", { name })).data;
  }

  async changeExercise(id: string, name: string): Promise<Exercise> {
    return (await api.patch(`/exercise/${id}`, { name })).data;
  }

  async deleteExercise(id: string): Promise<void> {
    await api.delete(`/exercise/${id}`);
  }
}

export default new ExerciseService();
