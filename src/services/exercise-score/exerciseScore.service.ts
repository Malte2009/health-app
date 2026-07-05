import api from "@/services/api.ts";
import type { ExerciseScore } from "@/types/exerciseScoreType.ts";

class ExerciseScoreService {
  async getExerciseScoresByName(exerciseName: string): Promise<ExerciseScore[]> {
    return (await api.get(`/exerciseScore/getExerciseScores/${exerciseName}`)).data;
  }
}

export default new ExerciseScoreService();
