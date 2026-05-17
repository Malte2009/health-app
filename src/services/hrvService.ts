import api from "./api";

export const getHrvRecordings = async (includeWindows: boolean = false) => {
    return (await api.get(`/hrv/getHrvRecording${includeWindows ? '?includeWindows=true' : ''}`)).data;
}

export const getHrvRecording = async (id: string, includeWindows: boolean = false) => {
    return (await api.get(`/hrv/getHrvRecording/${id}${includeWindows ? '?includeWindows=true' : ''}`)).data;
}

export const getHrvData = async (id: string, filters?: string) => {
    return (await api.get(`/hrv/getHrvData/${id}${filters ? `?filters=${filters}` : ''}`, { responseType: 'text' })).data;
}

export const getHrvWindowData = async (id: string, filters?: string) => {
    return (await api.get(`/hrv/getHrvWindowData/${id}${filters ? `?filters=${filters}` : ''}`, { responseType: 'text' })).data;
}

export const getHrvMetrics = async (id: string, filters: string) => {
    return (await api.get(`/hrv/getHrvMetrics/${id}?filters=${filters}`, { timeout: 0 })).data;
}

export const createHrvRecording = async (rrData: string, queryParams: any) => {
    return (await api.post(`/hrv/createHrvRecording`, rrData, {
        headers: { 'Content-Type': 'text/plain' },
        params: queryParams
    })).data;
}

export const updateHrvRecording = async (id: string, rrData?: string, queryParams?: any) => {
    return (await api.patch(`/hrv/updateHrvRecording/${id}`, rrData, {
        headers: { 'Content-Type': 'text/plain' },
        params: queryParams
    })).data;
}

export const deleteHrvRecording = async (id: string) => {
    return (await api.delete(`/hrv/deleteHrvRecording/${id}`)).data;
}
