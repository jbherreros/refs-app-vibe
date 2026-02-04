import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Genera la URL de Google Maps para abrir indicaciones hasta la dirección.
 * Abre en nueva pestaña y usa la ubicación actual como origen.
 */
export function getGoogleMapsDirectionsUrl(address: string): string {
  const encoded = encodeURIComponent(address.trim())
  return `https://www.google.com/maps/dir/?api=1&destination=${encoded}`
}
