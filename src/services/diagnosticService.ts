import api from './api';

export const getMicroOverMonth = async (start_date: string, end_date: string) => {
  const response = await api.get('/analysis/calender/microOverMonth', { params: { start_date, end_date } });
  return response.data;
};

export const getSymptomsOverMonth = async (start_date: string, end_date: string) => {
  const response = await api.get('/analysis/calender/symptomsOverMonth', { params: { start_date, end_date } });
  return response.data;
};

export const getSyncopesOverMonth = async (start_date: string, end_date: string) => {
  const response = await api.get('/analysis/calender/syncopesOverMonth', { params: { start_date, end_date } });
  return response.data;
};

export const getBloodPressureOverMonth = async (start_date: string, end_date: string) => {
  const response = await api.get('/analysis/calender/bloodPressureOverMonth', { params: { start_date, end_date } });
  return response.data;
};

export const getSleepOverMonth = async (start_date: string, end_date: string) => {
  const response = await api.get('/analysis/calender/sleepOverMonth', { params: { start_date, end_date } });
  return response.data;
};

export const getTrainingOverMonth = async (start_date: string, end_date: string) => {
  const response = await api.get('/analysis/calender/trainingOverMonth', { params: { start_date, end_date } });
  return response.data;
};

export const getDailyLogsOverMonth = async (start_date: string, end_date: string) => {
  const response = await api.get('/analysis/calender/dailyLogsOverMonth', { params: { start_date, end_date } });
  return response.data;
};

export const getIntakeLogsOverMonth = async (start_date: string, end_date: string) => {
  const response = await api.get('/analysis/calender/intakeLogsOverMonth', { params: { start_date, end_date } });
  return response.data;
};
