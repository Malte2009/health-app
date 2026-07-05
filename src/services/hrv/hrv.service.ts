import api from "@/services/api.ts";
import type { HrvMetric, HrvRecording, HrvRecordingQueryParams } from "@/types/hrvType.ts";
import type { HrvWindowsResponse } from "@/types/hrv/hrvWindow.type.ts";
import { isValidHrvFilterParam } from "@/utility/hrv.ts";

function assertValidFilters(filters?: string): void {
  if (filters && !isValidHrvFilterParam(filters)) {
    throw new Error(`Invalid HRV filters: ${filters}`);
  }
}

class HrvService {
  async getHrvRecordings(includeWindows: boolean = false): Promise<HrvRecording[]> {
    return (await api.get("/hrv", { params: includeWindows ? { includeWindows } : undefined })).data;
  }

  async getHrvRecording(id: string, includeWindows: boolean = false): Promise<HrvRecording> {
    return (await api.get(`/hrv/${id}`, { params: includeWindows ? { includeWindows } : undefined })).data;
  }

  async getHrvData(id: string, filters?: string): Promise<string> {
    assertValidFilters(filters);
    return (await api.get(`/hrv/data/${id}`, { params: filters ? { filters } : undefined, responseType: "text" })).data;
  }

  async getHrvWindowData(id: string, filters?: string): Promise<string> {
    assertValidFilters(filters);
    return (await api.get(`/hrv/window-data/${id}`, { params: filters ? { filters } : undefined, responseType: "text" })).data;
  }

  async getHrvWindows(recordingId: string): Promise<HrvWindowsResponse> {
    return (await api.get(`/hrv/${recordingId}/windows`)).data;
  }

  async getHrvMetrics(id: string, filters: string): Promise<HrvMetric> {
    assertValidFilters(filters);
    return (await api.get(`/hrv/metrics/${id}`, { params: { filters }, timeout: 0 })).data;
  }

  async createHrvRecording(rrData: string, queryParams: HrvRecordingQueryParams): Promise<HrvRecording> {
    return (
      await api.post(`/hrv`, rrData, {
        headers: { "Content-Type": "text/plain" },
        params: queryParams,
      })
    ).data;
  }

  async updateHrvRecording(id: string, rrData?: string, queryParams?: HrvRecordingQueryParams): Promise<HrvRecording> {
    return (
      await api.patch(`/hrv/${id}`, rrData, {
        headers: rrData ? { "Content-Type": "text/plain" } : undefined,
        params: queryParams,
      })
    ).data;
  }

  async deleteHrvRecording(id: string): Promise<unknown> {
    return (await api.delete(`/hrv/${id}`)).data;
  }
}

export default new HrvService();
