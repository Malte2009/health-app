export const MIN_HRV_RR_INTERVALS = 30;

export const HRV_FILTER_TOKENS = ["range", "artifact", "movingAverage"] as const;

export type HrvFilterToken = (typeof HRV_FILTER_TOKENS)[number];

export function parseRrIntervals(rawRrData: string): number[] {
  return rawRrData
    .split(/[\s,;]+/)
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value) && value > 0);
}

export function hasEnoughRrIntervals(rawRrData: string): boolean {
  return parseRrIntervals(rawRrData).length >= MIN_HRV_RR_INTERVALS;
}

export function buildHrvFilterParam(tokens: HrvFilterToken[]): "none" | string {
  return tokens.length > 0 ? tokens.join(",") : "none";
}

export function isValidHrvFilterParam(filters: string): boolean {
  if (filters === "none" || filters === "standard" || filters === "all") return true;
  const tokens = filters.split(",").filter(Boolean);
  return tokens.length > 0 && tokens.every((token) => HRV_FILTER_TOKENS.includes(token as HrvFilterToken));
}

export function isEndAfterStart(startTime: string, endTime: string): boolean {
  const startTimestamp = new Date(startTime).getTime();
  const endTimestamp = new Date(endTime).getTime();
  return Number.isFinite(startTimestamp) && Number.isFinite(endTimestamp) && endTimestamp > startTimestamp;
}
