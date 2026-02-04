import { externalFetch } from "../api-client";
import type { RefereePersonalData } from "../types";

export async function getRefereePersonalData(
  accessToken: string
): Promise<RefereePersonalData> {
  const raw = await externalFetch<RefereePersonalData>(
    "/auth/my-referee/personal-data",
    { accessToken, method: "GET" }
  );
  return raw as RefereePersonalData;
}
