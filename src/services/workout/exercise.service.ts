import api from "@/services/api.ts";
import type { Exercise } from "@/types/exerciseType.ts";

class ExerciseService {
  async getAllExercises(): Promise<Exercise[]> {
    try {
      return (await api.get("/exercise")).data;
    } catch (error) {
      return [];
    }
  }
  async getExerciseNames(): Promise<string[]> {
    try {
      return (await api.get("/exercise/names")).data;
    } catch (error) {
      return [];
    }
  }
  async getExerciseById(id: string, includeWorkoutExercises: boolean = true): Promise<Exercise | void> {
    try {
      return (await api.get(`/exercise/${id}?includeWorkoutExercises=${includeWorkoutExercises}`)).data;
    } catch (error) {
      return;
    }
  }
  async createExercise(name: string): Promise<Exercise | void> {
    try {
      return (await api.post("/exercise", { name })).data;
    } catch (error) {
      return;
    }
  }
  async changeExercise(id: string, name: string): Promise<Exercise | void> {
    try {
      return (await api.patch(`/exercise/${id}`, { name })).data;
    } catch (error) {
      return;
    }
  }
  async deleteExercise(id: string): Promise<void> {
    try {
      await api.delete(`/exercise/${id}`);
    } catch (error) {
      return;
    }
  }
}

export default new ExerciseService();
