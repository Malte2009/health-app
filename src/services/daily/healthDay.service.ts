import api from "@/services/api.ts";
import type {
  CreateHealthDayRequest,
  HealthDay,
  HealthDayIncludeQuery,
  HealthDayListQuery,
  UpdateHealthDayRequest,
} from "@/types/daily/healthDay.type.ts";

type HealthDayQueryParams = Record<string, string | boolean>;

function buildHealthDayParams(query?: HealthDayListQuery | HealthDayIncludeQuery): HealthDayQueryParams {
  const params: HealthDayQueryParams = {};
  if (!query) return params;

  const { include, ...rest } = query;

  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined && value !== null && value !== "") {
      params[key] = value;
    }
  }

  if (include !== undefined) {
    params.include = Array.isArray(include) ? include.join(",") : include;
  }

  return params;
}

class HealthDayService {
  async getHealthDays(query?: HealthDayListQuery): Promise<HealthDay[]> {
    return (await api.get("/health-days", { params: buildHealthDayParams(query) })).data;
  }

  async getHealthDayById(id: string, query?: HealthDayIncludeQuery): Promise<HealthDay> {
    return (await api.get(`/health-days/${id}`, { params: buildHealthDayParams(query) })).data;
  }

  async getHealthDayByDate(date: string, query?: HealthDayIncludeQuery): Promise<HealthDay> {
    return (await api.get(`/health-days/date/${date}`, { params: buildHealthDayParams(query) })).data;
  }

  async createHealthDay(data: CreateHealthDayRequest, query?: HealthDayIncludeQuery): Promise<HealthDay> {
    return (await api.post("/health-days", data, { params: buildHealthDayParams(query) })).data;
  }

  async updateHealthDay(id: string, data: UpdateHealthDayRequest, query?: HealthDayIncludeQuery): Promise<HealthDay> {
    return (await api.patch(`/health-days/${id}`, data, { params: buildHealthDayParams(query) })).data;
  }

  async replaceHealthDay(id: string, data: UpdateHealthDayRequest, query?: HealthDayIncludeQuery): Promise<HealthDay> {
    return (await api.put(`/health-days/${id}`, data, { params: buildHealthDayParams(query) })).data;
  }

  async deleteHealthDay(id: string): Promise<void> {
    await api.delete(`/health-days/${id}`);
  }
}

export default new HealthDayService();
