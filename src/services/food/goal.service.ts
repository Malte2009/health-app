import api from "@/services/api.ts";
import axios from "axios";
import type { UserGoals } from "@/types/foodType.ts";

class GoalService {
  async getGoals(): Promise<UserGoals | null> {
    try {
      return (await api.get("/goals")).data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) return null;
      throw error;
    }
  }

  async createGoals(goals: Partial<UserGoals>): Promise<UserGoals> {
    return (await api.post("/goals", goals)).data;
  }

  async updateGoals(goals: Partial<UserGoals>): Promise<UserGoals> {
    return (await api.patch("/goals", goals)).data;
  }

  async deleteGoals(): Promise<void> {
    await api.delete("/goals");
  }
}

export default new GoalService();
