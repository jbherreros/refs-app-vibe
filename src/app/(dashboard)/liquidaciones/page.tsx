import { auth } from "@/lib/auth";
import { getLiquidaciones } from "@/lib/services/liquidaciones";
import { getPaymentsNotPending } from "@/lib/services/payments-not-pending";
import { getPreliquidationWeekly } from "@/lib/services/preliquidation-weekly";
import type { Liquidacion } from "@/lib/types";
import type { PaymentNotPending } from "@/lib/types";
import type { PreliquidationWeeklyItem } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function formatEuro(n: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPeriod(initial: string, final: string) {
  const a = new Date(initial);
  const b = new Date(final);
  return `${a.toLocaleDateString("es-ES", { month: "short", year: "numeric" })} – ${b.toLocaleDateString("es-ES", { month: "short", year: "numeric" })}`;
}

/** Liquidación semanal */
function WeeklySection({ items }: { items: PreliquidationWeeklyItem[] }) {
  const totalNet = items.reduce((sum, i) => sum + i.netAmount, 0);
  const totalGross = items.reduce((sum, i) => sum + i.grossAmount, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">Liquidación semanal</CardTitle>
        <div className="text-right">
          <p className="text-lg font-semibold tabular-nums">{formatEuro(totalNet)}</p>
          <CardDescription>Neto · Bruto {formatEuro(totalGross)}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {items.map((item) => (
            <div key={item.liquidationId} className="flex flex-col gap-1.5 py-4 first:pt-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-foreground">
                  {[item.localTeamName, item.visitorTeamName].filter(Boolean).join(" – ") || "Partido"}
                </p>
                {item.categoryName && (
                  <Badge variant="secondary" className="text-[10px] font-normal">
                    {item.categoryName}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {item.formattedMatchDate ?? formatFecha(item.matchDate)}
                {item.conceptLiteral ? ` · ${item.conceptLiteral}` : ""}
              </p>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-0.5 text-xs">
                <span className="tabular-nums font-medium text-foreground">
                  Neto {formatEuro(item.netAmount)}
                </span>
                <span className="text-muted-foreground">
                  Bruto {formatEuro(item.grossAmount)}
                </span>
                {item.irpfRetentionAmount != null && item.irpfRetentionAmount > 0 && (
                  <span className="text-muted-foreground">
                    IRPF −{formatEuro(item.irpfRetentionAmount)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/** Card de un pago del histórico (solo móvil) */
function HistoricoPaymentCard({ p }: { p: PaymentNotPending }) {
  const period = formatPeriod(p.initialControlDate, p.finalControlDate);
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4">
      <p className="font-medium text-foreground">{period}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <span className="text-muted-foreground">Bruto</span>
        <span className="tabular-nums text-right">
          {formatEuro(p.grosAmount)}
          {p.amountHoldingIRPF > 0 && (
            <span className="block text-xs text-muted-foreground">IRPF −{formatEuro(p.amountHoldingIRPF)}</span>
          )}
        </span>
        <span className="text-muted-foreground">Neto</span>
        <span className="tabular-nums text-right font-medium">{formatEuro(p.netAmount)}</span>
        <span className="text-muted-foreground">A cobrar</span>
        <span className="tabular-nums text-right font-semibold text-primary">{formatEuro(p.toPayAmount)}</span>
      </div>
    </div>
  );
}

/** Histórico de pagos */
function HistoricoSection({ payments }: { payments: PaymentNotPending[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Histórico de liquidaciones</CardTitle>
        <CardDescription>Pagos ya procesados por período</CardDescription>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <div className="py-8">
            <div className="mx-auto flex max-w-[80px] justify-center text-muted-foreground/40">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-full" aria-hidden>
                <rect x="4" y="8" width="40" height="32" rx="2" />
                <path d="M4 20h40M16 8v8M32 8v8" />
              </svg>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              No hay historial de pagos.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile: lista de cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {payments.map((p) => (
                <HistoricoPaymentCard key={p.idPayment} p={p} />
              ))}
            </div>
            {/* Desktop: tabla */}
            <div className="hidden overflow-x-auto md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Período</TableHead>
                    <TableHead className="text-right">Bruto</TableHead>
                    <TableHead className="text-right">Neto</TableHead>
                    <TableHead className="text-right">A cobrar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.idPayment}>
                      <TableCell className="font-medium">
                        {formatPeriod(p.initialControlDate, p.finalControlDate)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatEuro(p.grosAmount)}
                        {p.amountHoldingIRPF > 0 && (
                          <span className="block text-xs">IRPF −{formatEuro(p.amountHoldingIRPF)}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{formatEuro(p.netAmount)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatEuro(p.toPayAmount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

/** Vista con API real */
function ApiView({
  weekly,
  historico,
}: {
  weekly: PreliquidationWeeklyItem[];
  historico: PaymentNotPending[];
}) {
  return (
    <div className="space-y-6 md:space-y-8">
      <h1 className="page-title">Liquidaciones</h1>
      {weekly.length > 0 && (
        <section>
          <WeeklySection items={weekly} />
        </section>
      )}
      <section>
        <HistoricoSection payments={historico} />
      </section>
    </div>
  );
}

/** Vista fallback (mock) */
function FallbackView({ liquidaciones }: { liquidaciones: Liquidacion[] }) {
  const total = liquidaciones.reduce((sum, l) => sum + l.importe, 0);

  return (
    <div className="space-y-6 md:space-y-8">
      <h1 className="page-title">Liquidaciones</h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base">Total</CardTitle>
          <p className="text-lg font-semibold tabular-nums">{formatEuro(total)}</p>
        </CardHeader>
        <CardContent>
          {liquidaciones.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No hay liquidaciones.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Importe</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liquidaciones.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.concepto}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatFecha(l.fecha)}
                      {l.partidoNombre ? ` · ${l.partidoNombre}` : ""}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatEuro(l.importe)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={l.estado === "pagado" ? "secondary" : "warning"}>
                        {l.estado === "pagado" ? "Pagado" : "Pendiente"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default async function LiquidacionesPage() {
  const session = await auth();
  const accessToken = (session as { accessToken?: string })?.accessToken;

  const useRealApi =
    accessToken &&
    process.env.EXTERNAL_API_URL &&
    process.env.USE_MOCK_API !== "true";

  if (useRealApi) {
    try {
      const [weekly, historico] = await Promise.all([
        getPreliquidationWeekly(accessToken!),
        getPaymentsNotPending(accessToken!),
      ]);
      const historicoRecientePrimero = [...historico].sort(
        (a, b) => new Date(b.finalControlDate).getTime() - new Date(a.finalControlDate).getTime()
      );
      return <ApiView weekly={weekly} historico={historicoRecientePrimero} />;
    } catch {
      // Fallback
    }
  }

  const liquidaciones = await getLiquidaciones(accessToken);
  return <FallbackView liquidaciones={liquidaciones} />;
}
