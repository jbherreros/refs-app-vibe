import { auth } from "@/lib/auth";
import { getPartidos } from "@/lib/services/partidos";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const accessToken = (session as { accessToken?: string }).accessToken;
    const partidos = await getPartidos(accessToken);
    return NextResponse.json(partidos);
  } catch (err) {
    console.error("GET /api/partidos:", err);
    return NextResponse.json(
      { error: "No se pudieron cargar los partidos" },
      { status: 500 }
    );
  }
}
