import api from "../api";

class ProgressionService {
  async getProgression(exerciseId: string): Promise<{ createdAt: Date; score: number; }[]> {
    return (await api.get("/workouts/progression/" + exerciseId)).data;
  }
}

export default new ProgressionService();
