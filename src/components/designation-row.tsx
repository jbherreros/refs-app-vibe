import Link from "next/link";
import type { DesignationStatusItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { DesignationDownloadButton } from "@/components/designation-download-button";
import { getGoogleMapsDirectionsUrl } from "@/lib/utils";
import { CalendarDays, MapPin, UserRound, Trophy } from "lucide-react";

type Props = {
  d: DesignationStatusItem;
  /** "download" = botón Descargar PDF. "accept" = botón verde Aceptar */
  action: "download" | "accept";
};

export function DesignationRow({ d, action }: Props) {
  const placeDisplay = [d.installationName, d.town].filter(Boolean).join(", ") || d.installationAddress || null;
  const placeForMaps = (d.installationAddress?.trim() || (placeDisplay ?? "")).trim();
  const fechaStr = d.matchDay
    ? new Date(d.matchDay).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
    : d.formattedMatchDay
      ? (() => {
          const p = new Date(d.formattedMatchDay!);
          return Number.isNaN(p.getTime()) ? d.formattedMatchDay! : p.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
        })()
      : "—";
  const teams = [d.localTeamName, d.visitorTeamName].filter(Boolean).join(" – ") || "Partido";

  return (
    <div className="flex flex-col gap-2 border-b border-border py-4 last:border-0 last:pb-0">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0 flex-1 space-y-1.5">
          {d.matchId != null ? (
            <Link href={`/partidos/${d.matchId}`} className="font-semibold leading-tight text-foreground hover:text-primary hover:underline">
              {teams}
            </Link>
          ) : (
            <p className="font-semibold leading-tight text-foreground">{teams}</p>
          )}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3.5 shrink-0" aria-hidden />
              {fechaStr}
            </span>
            {placeDisplay && (
              placeForMaps ? (
                <a
                  href={getGoogleMapsDirectionsUrl(placeForMaps)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <MapPin className="size-3.5 shrink-0" aria-hidden />
                  {placeDisplay}
                </a>
              ) : (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 shrink-0" aria-hidden />
                  {placeDisplay}
                </span>
              )
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {d.refereeFunctionNameShort && (
              <Badge variant="secondary" className="text-[10px] font-normal">
                <UserRound className="mr-0.5 size-2.5" aria-hidden />
                {d.refereeFunctionNameShort}
              </Badge>
            )}
            {d.categoryName && (
              <Badge variant="outline" className="text-[10px] font-normal">
                <Trophy className="mr-0.5 size-2.5" aria-hidden />
                {d.categoryName}
              </Badge>
            )}
            {d.competitionName && (
              <Badge variant="outline" className="text-[10px] font-normal">
                {d.competitionName}
              </Badge>
            )}
          </div>
        </div>
        <DesignationDownloadButton
          installationId={d.installationId}
          timeZone={d.timeZone}
          matchDay={d.matchDay}
          label={teams}
          variant={action}
        />
      </div>
    </div>
  );
}
