import { externalFetch } from "../api-client";
import type { MyMatchDesignation } from "../types";

export async function getMyMatches(
  accessToken: string
): Promise<MyMatchDesignation[]> {
  const raw = await externalFetch<MyMatchDesignation[]>(
    "/auth/my-referee/designations/my-matches",
    { accessToken, method: "GET" }
  );
  return Array.isArray(raw) ? raw : [];
}
