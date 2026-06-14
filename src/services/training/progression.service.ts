import api from "../api";

class ProgressionService {
  async getProgression(exerciseId: string): Promise<{ createdAt: Date; score: number; }[]> {
    try {
      return (await api.get("/training/progression/" + exerciseId)).data;
    } catch (error) {
      return [];
    }
  }
}

export default new ProgressionService();
