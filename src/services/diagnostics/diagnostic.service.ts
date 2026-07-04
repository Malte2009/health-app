import api from "@/services/api.ts";
import type { CalendarDateRangeRequest } from "@/types/diagnosticType.ts";

class DiagnosticService {
  private async getCalendarAnalysis(path: string, start_date: string, end_date: string): Promise<unknown> {
    const params: CalendarDateRangeRequest = { start_date, end_date };
    return (await api.get(`/analysis/calender/${path}`, { params })).data;
  }

  async getMicroOverMonth(start_date: string, end_date: string): Promise<unknown> {
    return this.getCalendarAnalysis("microOverMonth", start_date, end_date);
  }

  async getSymptomsOverMonth(start_date: string, end_date: string): Promise<unknown> {
    return this.getCalendarAnalysis("symptomsOverMonth", start_date, end_date);
  }

  async getSyncopesOverMonth(start_date: string, end_date: string): Promise<unknown> {
    return this.getCalendarAnalysis("syncopesOverMonth", start_date, end_date);
  }

  async getBloodPressureOverMonth(start_date: string, end_date: string): Promise<unknown> {
    return this.getCalendarAnalysis("bloodPressureOverMonth", start_date, end_date);
  }

  async getSleepOverMonth(start_date: string, end_date: string): Promise<unknown> {
    return this.getCalendarAnalysis("sleepOverMonth", start_date, end_date);
  }

  async getWorkoutsOverMonth(start_date: string, end_date: string): Promise<unknown> {
    return this.getCalendarAnalysis("workoutOverMonth", start_date, end_date);
  }

  async getDailyLogsOverMonth(start_date: string, end_date: string): Promise<unknown> {
    return this.getCalendarAnalysis("dailyLogsOverMonth", start_date, end_date);
  }

  async getIntakeLogsOverMonth(start_date: string, end_date: string): Promise<unknown> {
    return this.getCalendarAnalysis("intakeLogsOverMonth", start_date, end_date);
  }

  async getFoodOverMonth(start_date: string, end_date: string): Promise<unknown> {
    return this.getCalendarAnalysis("foodOverMonth", start_date, end_date);
  }
}

export default new DiagnosticService();
