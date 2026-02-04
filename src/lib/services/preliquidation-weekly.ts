import { externalFetch } from "../api-client";
import type { PreliquidationWeeklyItem } from "../types";

export async function getPreliquidationWeekly(
  accessToken: string
): Promise<PreliquidationWeeklyItem[]> {
  const raw = await externalFetch<PreliquidationWeeklyItem[]>(
    "/auth/my-referee/preliquidation/weekly",
    { accessToken, method: "GET" }
  );
  return Array.isArray(raw) ? raw : [];
}
