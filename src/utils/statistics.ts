/**
 * Implementation of the complementary error function (erfc)
 * Using approximation from Numerical Recipes in C (2nd ed.)
 */
export function erfc(x: number): number {
  const z = Math.abs(x);
  const t = 1.0 / (1.0 + 0.5 * z);
  
  const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 +
            t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 +
            t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 +
            t * (-0.82215223 + t * 0.17087277)))))))))
  
  return x >= 0 ? r : 2 - r;
}

/**
 * Calculate statistical significance between two variants
 */
export function calculateStatisticalSignificance(
  variantA: { clicks: number; impressions: number },
  variantB: { clicks: number; impressions: number }
) {
  const pA = variantA.clicks / variantA.impressions;
  const pB = variantB.clicks / variantB.impressions;
  const nA = variantA.impressions;
  const nB = variantB.impressions;
  
  const pooledStdErr = Math.sqrt((pA * (1 - pA)) / nA + (pB * (1 - pB)) / nB);
  const zScore = Math.abs((pB - pA) / pooledStdErr);
  
  // Convert z-score to confidence level
  const confidence = (1 - 0.5 * erfc(zScore / Math.sqrt(2))) * 100;
  
  const improvementPercent = ((pB - pA) / pA) * 100;
  
  return {
    winner: improvementPercent > 0 ? "B" : (improvementPercent < 0 ? "A" : null),
    confidenceLevel: confidence,
    improvementPercent: Math.abs(improvementPercent),
    recommendation: confidence > 95 
      ? `Variant ${improvementPercent > 0 ? 'B' : 'A'} is the clear winner with ${confidence.toFixed(1)}% confidence`
      : "Continue testing to reach statistical significance",
  };
}