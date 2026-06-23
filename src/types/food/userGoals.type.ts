export type UserGoals = {
  id: string;
  userId: string;
  createdAt: string;
  changedAt: string | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  sugar_g: number | null;
  saturated_fat_g: number | null;
  unsaturated_fat_g: number | null;
  salt_g: number | null;
};

export type CreateUserGoalsRequest = Omit<UserGoals, "id" | "userId" | "createdAt" | "changedAt">;
export type UpdateUserGoalsRequest = Partial<CreateUserGoalsRequest>;
