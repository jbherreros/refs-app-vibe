import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PartidoNotFound() {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            No se encontró el partido. Añade en tu <code className="rounded bg-muted px-1 text-xs">.env.local</code> la variable{" "}
            <code className="rounded bg-muted px-1 text-xs">PUBLIC_TOKEN_FBIB</code> con el token FBIB (ej.: la parte de la URL entre /fbib/1/ y /FCBQWeb/).
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/partidos">Volver a Partidos</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
