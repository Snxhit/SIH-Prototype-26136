export interface EvaluationScores {
  technical_merit: number;
  kpi_accuracy: number;
  cybersecurity: number;
  scalability: number;
  dpiit_recognition?: number;
}

export const EVALUATION_THRESHOLD = 85.0;
export const DPIIT_SCORE = 100;

export const SLIDER_MIN = 50;
export const SLIDER_MAX = 100;

export const EVALUATION_WEIGHTS = {
  technical_merit: 0.3,
  kpi_accuracy: 0.25,
  cybersecurity: 0.2,
  scalability: 0.15,
  dpiit_recognition: 0.1,
} as const;

export function computeWeightedScore(scores: EvaluationScores): number {
  return (
    Math.round(
      (scores.technical_merit * EVALUATION_WEIGHTS.technical_merit +
        scores.kpi_accuracy * EVALUATION_WEIGHTS.kpi_accuracy +
        scores.cybersecurity * EVALUATION_WEIGHTS.cybersecurity +
        scores.scalability * EVALUATION_WEIGHTS.scalability +
        (scores.dpiit_recognition ?? DPIIT_SCORE) * EVALUATION_WEIGHTS.dpiit_recognition) *
        10
    ) / 10
  );
}