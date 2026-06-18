import api from "./api";
import type { changeSetRequestType, createSetRequestType, set, workoutSet } from "@/types/setType.ts";

function normalizeWorkoutSet(workoutSet: workoutSet): set {
  return {
    ...workoutSet,
    exerciseLogId: workoutSet.workoutExerciseId,
  };
}

class WorkoutSetService {
  async getWorkoutSetById(workoutId: string, workoutExerciseId: string, setId: string): Promise<set | void> {
    try {
      return normalizeWorkoutSet((await api.get(`/workouts/${workoutId}/exercises/${workoutExerciseId}/sets/${setId}`)).data);
    } catch (error) {
      console.error(error);
    }
  }

  async getSetTypes(): Promise<string[]> {
    try {
      return (await api.get("/sets/types")).data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getSetUnits(): Promise<string[]> {
    try {
      return (await api.get("/sets/units")).data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createWorkoutSet(workoutId: string, workoutExerciseId: string, set: createSetRequestType): Promise<set | void> {
    const { workoutId: _workoutId, workoutExerciseId: _workoutExerciseId, ...body } = set;

    try {
      return normalizeWorkoutSet((await api.post(`/workouts/${workoutId}/exercises/${workoutExerciseId}/sets`, body)).data);
    } catch (error) {
      console.error(error);
    }
  }

  async changeWorkoutSet(set: changeSetRequestType): Promise<set | void> {
    const { id, workoutId, workoutExerciseId, ...body } = set;

    try {
      return normalizeWorkoutSet((await api.patch(`/workouts/${workoutId}/exercises/${workoutExerciseId}/sets/${id}`, body)).data);
    } catch (error) {
      console.error(error);
    }
  }

  async deleteWorkoutSet(workoutId: string, workoutExerciseId: string, setId: string): Promise<void> {
    try {
      await api.delete(`/workouts/${workoutId}/exercises/${workoutExerciseId}/sets/${setId}`);
    } catch (error) {
      console.error(error);
    }
  }
}

const workoutSetService = new WorkoutSetService();

export default workoutSetService;
