import api from "@/services/api.ts";
import type { UserGoals } from "@/types/foodType.ts";

class GoalService {
  async getGoals(): Promise<UserGoals | null> {
    try {
      return (await api.get("/goals")).data;
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { status?: number } }).response?.status === "number" &&
        (error as { response?: { status?: number } }).response?.status === 404
      ) return null;
      console.error(error);
      return null;
    }
  }

  async createGoals(goals: Partial<UserGoals>): Promise<UserGoals | void> {
    try {
      return (await api.post("/goals", goals)).data;
    } catch (error) {
      console.error(error);
    }
  }

  async updateGoals(goals: Partial<UserGoals>): Promise<UserGoals | void> {
    try {
      return (await api.patch("/goals", goals)).data;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteGoals(): Promise<void> {
    try {
      await api.delete("/goals");
    } catch (error) {
      console.error(error);
    }
  }
}

export default new GoalService();
