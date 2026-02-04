import { externalFetch } from "../api-client";
import { mockResumenMes } from "../mock-data";
import type { ResumenMes } from "../types";
import { getPaymentsNotPending } from "./payments-not-pending";

function useMock(): boolean {
  return (
    process.env.USE_MOCK_API === "true" || !process.env.EXTERNAL_API_URL
  );
}

/** Ruta del endpoint de resumen del mes (por defecto /resumen-mes). Puedes usar p. ej. /auth/my-referee/resumen-mes */
function getResumenMesPath(): string {
  return process.env.EXTERNAL_API_RESUMEN_MES_PATH?.trim() || "/resumen-mes";
}

/** Resumen por defecto cuando no hay datos */
function defaultResumenMes(): ResumenMes {
  const now = new Date();
  return {
    totalEuros: 0,
    mes: now.getMonth() + 1,
    anio: now.getFullYear(),
  };
}

/** Calcula total del mes actual a partir de pagos (fallback cuando no hay endpoint de resumen) */
async function resumenMesFromPayments(accessToken: string): Promise<ResumenMes> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  try {
    const payments = await getPaymentsNotPending(accessToken);
    const total = payments
      .filter((p) => {
        const d = new Date(p.finalControlDate);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .reduce((sum, p) => sum + p.toPayAmount, 0);
    return {
      totalEuros: total,
      mes: month + 1,
      anio: year,
    };
  } catch {
    return defaultResumenMes();
  }
}

export async function getResumenMes(
  accessToken?: string
): Promise<ResumenMes> {
  if (useMock()) {
    const now = new Date();
    return {
      ...mockResumenMes,
      mes: now.getMonth() + 1,
      anio: now.getFullYear(),
    };
  }
  try {
    const path = getResumenMesPath();
    const raw = await externalFetch<ResumenMes | { data: ResumenMes }>(
      path,
      { accessToken }
    );
    const data = (raw as { data?: ResumenMes }).data ?? raw;
    return normalizeResumenMes((data ?? {}) as unknown as Record<string, unknown>);
  } catch {
    // Si falla el endpoint (p. ej. 404), intentar calcular desde pagos del mes
    if (accessToken) {
      return resumenMesFromPayments(accessToken);
    }
    return defaultResumenMes();
  }
}

function normalizeResumenMes(r: Record<string, unknown>): ResumenMes {
  const now = new Date();
  return {
    totalEuros: Number(r.totalEuros ?? r.total ?? 0),
    mes: Number(r.mes ?? now.getMonth() + 1),
    anio: Number(r.anio ?? now.getFullYear()),
    cantidadPartidos: r.cantidadPartidos != null ? Number(r.cantidadPartidos) : undefined,
    cantidadLiquidaciones: r.cantidadLiquidaciones != null ? Number(r.cantidadLiquidaciones) : undefined,
  };
}
