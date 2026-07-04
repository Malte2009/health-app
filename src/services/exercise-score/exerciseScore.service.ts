import api from "@/services/api.ts";
import type { ExerciseScore } from "@/types/exerciseScoreType.ts";

class ExerciseScoreService {
  async getExerciseScoresByName(exerciseName: string): Promise<ExerciseScore[] | void> {
    try {
      return (await api.get(`/exerciseScore/getExerciseScores/${exerciseName}`)).data;
    } catch (error) {
      console.error(error);
    }
  }
}

export default new ExerciseScoreService();
