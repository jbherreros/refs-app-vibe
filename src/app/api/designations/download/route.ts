import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { externalFetchBinary } from "@/lib/api-client";

export async function POST(req: Request) {
  const session = await auth();
  const accessToken = (session as { accessToken?: string })?.accessToken;
  if (!accessToken) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: { installationId?: string | number; timeZone?: string; matchDay?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Cuerpo de la petición inválido" },
      { status: 400 }
    );
  }

  const installationId = body.installationId;
  const timeZone = body.timeZone ?? "";
  const matchDay = body.matchDay ?? "";

  if (installationId == null || installationId === "") {
    return NextResponse.json(
      { error: "Falta installationId" },
      { status: 400 }
    );
  }

  try {
    const buffer = await externalFetchBinary(
      "/auth/my-referee/designations/accept",
      {
        accessToken,
        body: {
          installationId: String(installationId),
          timeZone,
          matchDay,
        },
      }
    );
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="designacion.pdf"',
      },
    });
  } catch (err) {
    console.error("Designation download error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al descargar" },
      { status: 500 }
    );
  }
}
