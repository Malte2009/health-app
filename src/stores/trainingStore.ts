import { defineStore } from "pinia";

import { createTrainingLog, getTrainingLogById, getTrainingLogs, updateTrainingLog, deleteTrainingLog } from "@/services/trainingService.ts";
import type { trainingLog } from "@/types/trainingType.ts";
import { createExerciseLog, updateExerciseLog } from "@/services/exerciseLogService.ts";

export const useTrainingLogStore = defineStore("trainingLogStore", {
  state: () => ({
    trainingLogs: [] as trainingLog[],
    currentTraining: "",
  }),

  actions: {
    async getTrainingLogs(): Promise<trainingLog[]> {

      if (this.trainingLogs.length === 0) this.trainingLogs = await getTrainingLogs();

      return this.trainingLogs;
    },

    async getTrainingLogById(trainingId: string): Promise<trainingLog | void> {

      if (this.trainingLogs.length === 0) {
        const trainingLog = await getTrainingLogById(trainingId);

        if (trainingLog) this.trainingLogs.push(trainingLog);

        return trainingLog;
      } else  {
        const trainingLog = this.trainingLogs.find(training => training.id === trainingId);

        if (trainingLog?.exerciseLogs) return trainingLog;

        const trainingLogWithExercises = await getTrainingLogById(trainingId);

        if (trainingLogWithExercises) {
          const index = this.trainingLogs.findIndex(training => training.id === trainingId);

          this.trainingLogs[index] = trainingLogWithExercises;

          return trainingLogWithExercises;
        }
      }
    },
    async updateTrainingLog(id: string, trainingLog: trainingLog) {
      const updatedTrainingLog = await updateTrainingLog(id, trainingLog);

      if (updatedTrainingLog) {
        const index = this.trainingLogs.findIndex((training) => training.id === id);

        if (index !== -1) this.trainingLogs[index] = updatedTrainingLog;
      }
    },

    async createTrainingLog(trainingLog: trainingLog) {
        const createdTrainingLog = await createTrainingLog(trainingLog);

        if (createdTrainingLog) this.trainingLogs.unshift(createdTrainingLog);
    },

    async deleteTrainingLog(id: string) {
      await deleteTrainingLog(id);

      this.trainingLogs = this.trainingLogs.filter(training => training.id !== id);
    },
    async updateExerciseLog(exerciseLogId: string, name?: string, notes?: string, order?: number) {
      for (const trainingLog of this.trainingLogs) {
        const exerciseLog = trainingLog.exerciseLogs.find(exercise => exercise.id === exerciseLogId);

        if (exerciseLog) {
          if (name !== undefined) exerciseLog.name = name;
          if (notes !== undefined) exerciseLog.notes = notes;
          if (order !== undefined) exerciseLog.order = order;

          await updateExerciseLog(exerciseLogId, name, notes, order);
          return;
        }
      }
    },

    async createExerciseLog(trainingLogId: string, name: string, notes?: string, order?: number) {
        const trainingLog = this.trainingLogs.find(training => training.id === trainingLogId);

        if (trainingLog) {
          const newExerciseLog = await createExerciseLog(trainingLogId, name, order || 0, notes);

          if (newExerciseLog) trainingLog.exerciseLogs.push(newExerciseLog);
        }
    },

    async deleteExerciseLog(exerciseLogId: string) {
      for (const trainingLog of this.trainingLogs) {
        const exerciseLogIndex = trainingLog.exerciseLogs.findIndex(exercise => exercise.id === exerciseLogId);

        if (exerciseLogIndex !== -1) {
          trainingLog.exerciseLogs.splice(exerciseLogIndex, 1);
          return;
        }
      }
    }
  },
});
