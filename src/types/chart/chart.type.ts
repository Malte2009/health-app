export type ChartValueType = "number" | "boolean" | "duration" | "score" | "count";

export type ChartCadence = "sample" | "window" | "event" | "daily";

export type ChartBucket = "raw" | "hour" | "day" | "week" | "month";

export type ChartAggregation = "avg" | "sum" | "min" | "max" | "count" | "latest";

export type ChartDataPoint = {
  id: string;
  label: string;
  group: string;
  unit: string | null;
  valueType: ChartValueType;
  cadence: ChartCadence;
  defaultAggregation: ChartAggregation;
  allowedAggregations: ChartAggregation[];
  defaultVisible: boolean;
  searchableText: string;
};

export type ChartSeriesRequest = {
  startDate: string;
  endDate: string;
  bucket: ChartBucket;
  series: Array<{
    dataPointId: string;
    aggregation?: ChartAggregation;
  }>;
};

export type ChartSeriesPoint = {
  x: string;
  y: number | null;
};

export type ChartSeries = {
  dataPointId: string;
  label: string;
  unit: string | null;
  points: ChartSeriesPoint[];
};

export type ChartSeriesResponse = {
  series: ChartSeries[];
};
