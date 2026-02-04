import { auth } from "@/lib/auth";
import { getLiquidaciones } from "@/lib/services/liquidaciones";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const accessToken = (session as { accessToken?: string }).accessToken;
    const liquidaciones = await getLiquidaciones(accessToken);
    return NextResponse.json(liquidaciones);
  } catch (err) {
    console.error("GET /api/liquidaciones:", err);
    return NextResponse.json(
      { error: "No se pudieron cargar las liquidaciones" },
      { status: 500 }
    );
  }
}
