import { externalFetch } from "../api-client";
import type { DesignationsStatus } from "../types";

export async function getDesignationsStatus(
  accessToken: string
): Promise<DesignationsStatus> {
  const raw = await externalFetch<DesignationsStatus>(
    "/auth/my-referee/designations/status",
    { accessToken, method: "GET" }
  );
  if (raw && typeof raw !== "object") return defaultStatus();
  const r = raw as unknown as Record<string, unknown>;
  return {
    downloaded: Array.isArray(r.downloaded) ? (r.downloaded as DesignationsStatus["downloaded"]) : [],
    refused: Array.isArray(r.refused) ? r.refused : [],
    pending: Array.isArray(r.pending) ? (r.pending as DesignationsStatus["pending"]) : [],
    substitutions: Array.isArray(r.substitutions) ? r.substitutions : [],
  };
}

function defaultStatus(): DesignationsStatus {
  return {
    downloaded: [],
    refused: [],
    pending: [],
    substitutions: [],
  };
}
