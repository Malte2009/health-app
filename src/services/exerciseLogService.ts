import api from "./api";

export const getExerciseLogById = async (id: string): Promise<exerciseLog | void> => {
  try {
    return (await api.get(`/exerciseLog/getExerciseLog/${id}`)).data;
  } catch (error) {
    console.error(error);
  }
};

export const updateExerciseLog = async (exerciseId: string, name?: string, notes?: string, order?: number): Promise<exerciseLog | void> => {
  try {
    return (await api.patch(`/exerciseLog/changeExerciseLog/${exerciseId}`, { name, notes, order, })).data;
  } catch (error) {
    console.error(error);
  }
};

export const createExerciseLog = async (trainingLogId: string, name: string, order: number, notes?: string): Promise<exerciseLog | void> => {
  try {
    return (await api.post("/exerciseLog/createExerciseLog", { trainingId: trainingLogId, name, order, notes})).data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteExerciseLogRequest = async (id: string): Promise<void> => {
  try {
    await api.delete(`/exerciseLog/deleteExerciseLog/${id}`);
  } catch (error) {
    console.error(error);
  }
};
