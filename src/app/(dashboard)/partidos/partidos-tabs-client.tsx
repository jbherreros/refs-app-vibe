"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { Partido } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getGoogleMapsDirectionsUrl } from "@/lib/utils";
import { CalendarDays, MapPin } from "lucide-react";

function PartidoRow({ p }: { p: Partido }) {
  const d = new Date(p.fecha + "T" + (p.hora || "00:00"));
  const fechaStr = d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  const diaSemana = d.toLocaleDateString("es-ES", { weekday: "short" });

  return (
    <div className="flex gap-3 border-b border-border py-4 last:border-0 last:pb-0">
      <Link
        href={`/partidos/${p.id}`}
        className="flex shrink-0 flex-col items-center rounded-lg bg-muted/80 px-2.5 py-1.5 text-center transition-colors hover:bg-muted"
      >
        <span className="text-[10px] font-medium uppercase leading-tight text-muted-foreground">
          {diaSemana}
        </span>
        <span className="text-sm font-bold tabular-nums text-foreground">
          {d.toLocaleDateString("es-ES", { day: "numeric" })}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </Link>
      <div className="min-w-0 flex-1 space-y-1">
        <Link
          href={`/partidos/${p.id}`}
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
          title={`${p.equipoLocal} – ${p.equipoVisitante}`}
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted" aria-hidden />
          <span className="text-muted-foreground">–</span>
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted" aria-hidden />
        </Link>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3.5 shrink-0" aria-hidden />
            {fechaStr}
          </span>
          {p.lugar && (
            <a
              href={getGoogleMapsDirectionsUrl(p.lugar)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              {p.lugar}
              <span className="sr-only"> (abre Google Maps para indicaciones)</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyPartidosState() {
  return (
    <div className="py-10">
      <div className="mx-auto flex max-w-[100px] justify-center text-muted-foreground/40">
        <CalendarDays className="size-16" strokeWidth="1.5" aria-hidden />
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        No hay partidos en esta lista.
      </p>
    </div>
  );
}

export function PartidosTabsClient({
  pendientes,
  finalizados,
}: {
  pendientes: Partido[];
  finalizados: Partido[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const estado = searchParams.get("estado") === "finalizado" ? "finalizado" : "pendiente";

  function onTabChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "finalizado") {
      params.set("estado", "finalizado");
    } else {
      params.delete("estado");
    }
    router.push(`/partidos${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <Tabs value={estado} onValueChange={onTabChange}>
      <CardHeader className="pb-2">
        <TabsList variant="line" className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger value="pendiente" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none">
            Pendientes ({pendientes.length})
          </TabsTrigger>
          <TabsTrigger value="finalizado" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none">
            Finalizados ({finalizados.length})
          </TabsTrigger>
        </TabsList>
      </CardHeader>
      <CardContent className="pt-4">
        <TabsContent value="pendiente" className="mt-0">
          {pendientes.length === 0 ? (
            <EmptyPartidosState />
          ) : (
            <div className="divide-y divide-border">
              {pendientes.map((p) => (
                <PartidoRow key={p.id} p={p} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="finalizado" className="mt-0">
          {finalizados.length === 0 ? (
            <EmptyPartidosState />
          ) : (
            <div className="divide-y divide-border">
              {finalizados.map((p) => (
                <PartidoRow key={p.id} p={p} />
              ))}
            </div>
          )}
        </TabsContent>
      </CardContent>
    </Tabs>
  );
}
