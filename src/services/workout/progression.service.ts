import api from "../api";

class ProgressionService {
  async getProgression(exerciseId: string): Promise<{ createdAt: Date; score: number; }[]> {
    try {
      return (await api.get("/workouts/progression/" + exerciseId)).data;
    } catch {
      return [];
    }
  }
}

export default new ProgressionService();
