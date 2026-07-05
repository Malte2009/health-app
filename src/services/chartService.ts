import api from "@/services/api.ts";
import type { ChartDataPoint, ChartSeriesRequest, ChartSeriesResponse } from "@/types/chart/chart.type.ts";

export const getChartDataPoints = async (): Promise<ChartDataPoint[]> => {
  return (await api.get("/chart/datapoints")).data;
};

export const getChartSeries = async (request: ChartSeriesRequest): Promise<ChartSeriesResponse> => {
  return (await api.post("/chart/series", request)).data;
};
