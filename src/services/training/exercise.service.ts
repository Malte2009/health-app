import api from "@/services/api.ts";
import type { exerciseType } from "@/types/exerciseType.ts";

class ExerciseService {
  async getAllExercises(): Promise<exerciseType[]> {
    try {
      return (await api.get("/exercise")).data;
    } catch (error) {
      return [];
    }
  }
}

export default new ExerciseService();
