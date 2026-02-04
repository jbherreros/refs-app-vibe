"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Download } from "lucide-react";

type Props = {
  installationId: number | null;
  timeZone: string | null;
  matchDay: string | null;
  /** Etiqueta del partido para el nombre del archivo (opcional) */
  label?: string;
  /** "download" = Descargar PDF (outline). "accept" = Aceptar (verde, descarga al aceptar) */
  variant?: "download" | "accept";
};

export function DesignationDownloadButton({
  installationId,
  timeZone,
  matchDay,
  label,
  variant = "download",
}: Props) {
  const [loading, setLoading] = useState(false);

  const canDownload =
    installationId != null &&
    timeZone != null &&
    matchDay != null;

  async function handleDownload() {
    if (!canDownload) return;
    setLoading(true);
    try {
      const res = await fetch("/api/designations/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          installationId: String(installationId),
          timeZone: timeZone ?? "",
          matchDay: matchDay ?? "",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Error ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = label
        ? `designacion-${label.replace(/[^a-z0-9-]/gi, "-").slice(0, 40)}.pdf`
        : "designacion.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Error al descargar el PDF");
    } finally {
      setLoading(false);
    }
  }

  if (!canDownload) return null;

  const isAccept = variant === "accept";

  return (
    <Button
      type="button"
      variant={isAccept ? "default" : "outline"}
      size="sm"
      onClick={handleDownload}
      disabled={loading}
      className={
        isAccept
          ? "shrink-0 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          : "shrink-0"
      }
    >
      {isAccept ? (
        <Check className="size-4" aria-hidden />
      ) : (
        <Download className="size-4" aria-hidden />
      )}
      {loading
        ? isAccept
          ? "Aceptando…"
          : "Descargando…"
        : isAccept
          ? "Aceptar"
          : "Descargar PDF"}
    </Button>
  );
}
