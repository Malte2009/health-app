import api from "@/services/api.ts";
import type { HrvMetric, HrvRecording, HrvRecordingQueryParams } from "@/types/hrvType.ts";
import type { HrvWindowsResponse } from "@/types/hrv/hrvWindow.type.ts";

class HrvService {
  async getHrvRecordings(includeWindows: boolean = false): Promise<HrvRecording[]> {
    return (await api.get(`/hrv${includeWindows ? "?includeWindows=true" : ""}`)).data;
  }

  async getHrvRecording(id: string, includeWindows: boolean = false): Promise<HrvRecording> {
    return (await api.get(`/hrv/${id}${includeWindows ? "?includeWindows=true" : ""}`)).data;
  }

  async getHrvData(id: string, filters?: string): Promise<string> {
    return (await api.get(`/hrv/data/${id}${filters ? `?filters=${filters}` : ""}`, { responseType: "text" })).data;
  }

  async getHrvWindowData(id: string, filters?: string): Promise<string> {
    return (await api.get(`/hrv/window-data/${id}${filters ? `?filters=${filters}` : ""}`, { responseType: "text" })).data;
  }

  async getHrvWindows(recordingId: string): Promise<HrvWindowsResponse> {
    return (await api.get(`/hrv/${recordingId}/windows`)).data;
  }

  async getHrvMetrics(id: string, filters: string): Promise<HrvMetric> {
    return (await api.get(`/hrv/metrics/${id}?filters=${filters}`, { timeout: 0 })).data;
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
        headers: { "Content-Type": "text/plain" },
        params: queryParams,
      })
    ).data;
  }

  async deleteHrvRecording(id: string): Promise<unknown> {
    return (await api.delete(`/hrv/${id}`)).data;
  }
}

export default new HrvService();
