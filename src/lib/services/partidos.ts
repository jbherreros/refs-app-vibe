import { externalFetch } from "../api-client";
import { mockPartidos } from "../mock-data";
import type { Partido } from "../types";

function useMock(): boolean {
  return (
    process.env.USE_MOCK_API === "true" || !process.env.EXTERNAL_API_URL
  );
}

export async function getPartidos(accessToken?: string): Promise<Partido[]> {
  if (useMock()) {
    return [...mockPartidos].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  }
  const raw = await externalFetch<Partido[] | { data: Partido[] }>(
    "/partidos",
    { accessToken }
  );
  const list = Array.isArray(raw) ? raw : (raw as { data: Partido[] }).data;
  return (list ?? []).map((p) => normalizePartido(p as unknown as Record<string, unknown>));
}

function normalizePartido(p: Record<string, unknown>): Partido {
  return {
    id: String(p.id ?? ""),
    fecha: String(p.fecha ?? ""),
    hora: String(p.hora ?? ""),
    equipoLocal: String(p.equipoLocal ?? p.local ?? ""),
    equipoVisitante: String(p.equipoVisitante ?? p.visitante ?? ""),
    lugar: String(p.lugar ?? ""),
    estado: (p.estado === "finalizado" ? "finalizado" : "pendiente") as Partido["estado"],
  };
}
