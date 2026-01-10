import api from "@/services/api.ts";


export async function getExerciseScoresByName(exerciseName: string): Promise<{score: number; createdAt: string}[] | void> {
  try {
    return (await api.get(`/exerciseScore/getExerciseScores/${exerciseName}`)).data;
  } catch (error) {
    console.error(error);
  }
}
