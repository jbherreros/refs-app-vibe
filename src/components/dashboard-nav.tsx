"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/partidos", label: "Partidos" },
  { href: "/liquidaciones", label: "Liquidaciones" },
  { href: "/perfil", label: "Perfil" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <nav className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:flex-nowrap sm:gap-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo1.png"
            alt="Árbitros"
            width={120}
            height={32}
            className="h-6 w-auto"
            priority
          />
        </Link>
        <ul className="flex flex-wrap gap-1 sm:gap-0.5">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className={cn(
                  pathname === href && "bg-accent text-accent-foreground"
                )}
              >
                <Link href={href}>{label}</Link>
              </Button>
            </li>
          ))}
        </ul>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Salir
        </Button>
      </nav>
    </header>
  );
}
