import { auth } from "@/lib/auth";
import { getMatchDetail } from "@/lib/services/match-detail";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID de partido requerido" }, { status: 400 });
    }
    const data = await getMatchDetail(id);
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/partidos/[id]:", err);
    const message = err instanceof Error ? err.message : "No se pudo cargar el partido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
