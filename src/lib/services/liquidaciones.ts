import { externalFetch } from "../api-client";
import { mockLiquidaciones } from "../mock-data";
import type { Liquidacion } from "../types";

function useMock(): boolean {
  return (
    process.env.USE_MOCK_API === "true" || !process.env.EXTERNAL_API_URL
  );
}

export async function getLiquidaciones(
  accessToken?: string
): Promise<Liquidacion[]> {
  if (useMock()) {
    return [...mockLiquidaciones].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  }
  const raw = await externalFetch<Liquidacion[] | { data: Liquidacion[] }>(
    "/liquidaciones",
    { accessToken }
  );
  const list = Array.isArray(raw) ? raw : (raw as { data: Liquidacion[] }).data;
  return (list ?? []).map((l) => normalizeLiquidacion(l as unknown as Record<string, unknown>));
}

function normalizeLiquidacion(l: Record<string, unknown>): Liquidacion {
  return {
    id: String(l.id ?? ""),
    fecha: String(l.fecha ?? ""),
    concepto: String(l.concepto ?? ""),
    partidoId: l.partidoId != null ? String(l.partidoId) : undefined,
    partidoNombre: l.partidoNombre != null ? String(l.partidoNombre) : undefined,
    importe: Number(l.importe ?? 0),
    estado: l.estado === "pagado" ? "pagado" : "pendiente",
  };
}
