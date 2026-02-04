import { externalFetch } from "../api-client";
import type { PaymentNotPending } from "../types";

export async function getPaymentsNotPending(
  accessToken: string
): Promise<PaymentNotPending[]> {
  const raw = await externalFetch<PaymentNotPending[]>(
    "/auth/my-referee/payments/not-pending",
    { accessToken, method: "GET" }
  );
  return Array.isArray(raw) ? raw : [];
}
