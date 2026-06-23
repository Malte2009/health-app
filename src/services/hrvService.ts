import api from "./api";
import type { HrvWindowsResponse } from "@/types/hrv/hrvWindow.type.ts";

export type HrvRecordingQueryParams = {
    name?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    device?: string;
    context?: string;
    workoutId?: string;
    sleepLogId?: string;
}

export const getHrvRecordings = async (includeWindows: boolean = false) => {
    return (await api.get(`/hrv${includeWindows ? '?includeWindows=true' : ''}`)).data;
}

export const getHrvRecording = async (id: string, includeWindows: boolean = false) => {
    return (await api.get(`/hrv/${id}${includeWindows ? '?includeWindows=true' : ''}`)).data;
}

export const getHrvData = async (id: string, filters?: string) => {
    return (await api.get(`/hrv/data/${id}${filters ? `?filters=${filters}` : ''}`, { responseType: 'text' })).data;
}

export const getHrvWindowData = async (id: string, filters?: string) => {
    return (await api.get(`/hrv/window-data/${id}${filters ? `?filters=${filters}` : ''}`, { responseType: 'text' })).data;
}

export const getHrvWindows = async (recordingId: string): Promise<HrvWindowsResponse> => {
    return (await api.get(`/hrv/${recordingId}/windows`)).data;
}

export const getHrvMetrics = async (id: string, filters: string) => {
    return (await api.get(`/hrv/metrics/${id}?filters=${filters}`, { timeout: 0 })).data;
}

export const createHrvRecording = async (rrData: string, queryParams: HrvRecordingQueryParams) => {
    return (await api.post(`/hrv`, rrData, {
        headers: { 'Content-Type': 'text/plain' },
        params: queryParams
    })).data;
}

export const updateHrvRecording = async (id: string, rrData?: string, queryParams?: HrvRecordingQueryParams) => {
    return (await api.patch(`/hrv/${id}`, rrData, {
        headers: { 'Content-Type': 'text/plain' },
        params: queryParams
    })).data;
}

export const deleteHrvRecording = async (id: string) => {
    return (await api.delete(`/hrv/${id}`)).data;
}
