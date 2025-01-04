export interface MetricData {
  platform: string;
  roas?: number;
  ctr?: number;
  date: string;
  [key: string]: any;
}

export function analyzePlatformPerformance(metrics: MetricData[]) {
  const platformMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.platform]) {
      acc[metric.platform] = {
        roas: 0,
        count: 0
      };
    }
    acc[metric.platform].roas += metric.roas || 0;
    acc[metric.platform].count++;
    return acc;
  }, {} as Record<string, { roas: number; count: number; }>);

  let bestPlatform = '';
  let bestRoas = 0;

  Object.entries(platformMetrics).forEach(([platform, data]) => {
    const avgRoas = data.roas / data.count;
    if (avgRoas > bestRoas) {
      bestRoas = avgRoas;
      bestPlatform = platform;
    }
  });

  return { bestPlatform };
}

export function analyzeTrends(metrics: MetricData[]) {
  const sortedMetrics = metrics.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const ctrValues = sortedMetrics.map(m => m.ctr || 0);
  const ctrTrend = calculateTrend(ctrValues);

  return { ctrTrend };
}

export function analyzeCompetitiveMetrics(metrics: MetricData[]) {
  const avgRoas = metrics.reduce((sum, m) => sum + (m.roas || 0), 0) / metrics.length;
  const industryAvgRoas = 2.0; // Industry benchmark
  const relativePerformance = ((avgRoas - industryAvgRoas) / industryAvgRoas) * 100;

  return { relativePerformance };
}

function calculateTrend(values: number[]): number {
  if (values.length < 2) return 0;
  const first = values[0];
  const last = values[values.length - 1];
  return ((last - first) / first) * 100;
}