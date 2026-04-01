import api from "./api";
import type { UserGoals } from "@/types/foodType.ts";

export const getGoals = async (): Promise<UserGoals | null> => {
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
};

export const createGoals = async (goals: Partial<UserGoals>): Promise<UserGoals | void> => {
  try {
    return (await api.post("/goals", goals)).data;
  } catch (error) {
    console.error(error);
  }
};

export const updateGoals = async (goals: Partial<UserGoals>): Promise<UserGoals | void> => {
  try {
    return (await api.patch("/goals", goals)).data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteGoals = async (): Promise<void> => {
  try {
    await api.delete("/goals");
  } catch (error) {
    console.error(error);
  }
};
