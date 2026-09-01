export interface SandboxConfig {
  environment: string;
  data_privacy: string;
  stop_loss: string;
  ip_retainment: string;
}

export interface SandboxPilot {
  id: string;
  challenge_id: string | null;
  startup_name: string;
  status: "active" | "completed" | "scaled_up";
  tranche_amount: number;
  environment: string;
  data_privacy: string;
  stop_loss: string;
  ip_retainment: string;
}

export const SANDBOX_ENVIRONMENT_OPTIONS = [
  "Geofenced 5km Urban Zone",
  "Synthetic Data Testbed",
  "Shadow Telemetry Mode",
] as const;

export const SANDBOX_PRIVACY_OPTIONS = [
  "Anonymized PII + Edge Ingestion",
  "100% Synthetic Dummy Datasets",
  "Air-Gapped Local Edge Compute Only",
] as const;

export const SANDBOX_STOP_LOSS_OPTIONS = [
  "Max 5.0% False Positive Tolerance",
  "Strict: Max 2.0% Anomaly Deviation",
  "Relaxed: Max 10.0% Early Prototype",
] as const;

export const SANDBOX_IP_RETAINMENT = "100% Retained by Startup";
export const SANDBOX_DURATION = "60 Calendar Days";
export const SANDBOX_CLOUD = "MeitY Empanelled Cloud (India Region)";
export const SANDBOX_ROLLBACK = "Automated Failover to Legacy Operations";

export function sandboxConfigOf(pilot: Pick<SandboxPilot, "environment" | "data_privacy" | "stop_loss" | "ip_retainment">): SandboxConfig {
  return {
    environment: pilot.environment,
    data_privacy: pilot.data_privacy,
    stop_loss: pilot.stop_loss,
    ip_retainment: pilot.ip_retainment,
  };
}