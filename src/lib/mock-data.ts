import type { Liquidacion, Partido, ResumenMes } from "./types";

export const mockPartidos: Partido[] = [
  {
    id: "1",
    fecha: "2025-02-10",
    hora: "18:00",
    equipoLocal: "CB Estudiantes",
    equipoVisitante: "Real Madrid",
    lugar: "Pabellón Magariños",
    estado: "pendiente",
  },
  {
    id: "2",
    fecha: "2025-02-12",
    hora: "20:30",
    equipoLocal: "Barcelona",
    equipoVisitante: "Valencia Basket",
    lugar: "Palau Blaugrana",
    estado: "pendiente",
  },
  {
    id: "3",
    fecha: "2025-02-01",
    hora: "17:00",
    equipoLocal: "Unicaja",
    equipoVisitante: "Baskonia",
    lugar: "Palacio de Deportes",
    estado: "finalizado",
  },
  {
    id: "4",
    fecha: "2025-01-28",
    hora: "19:00",
    equipoLocal: "Gran Canaria",
    equipoVisitante: "Joventut",
    lugar: "Gran Canaria Arena",
    estado: "finalizado",
  },
];

export const mockLiquidaciones: Liquidacion[] = [
  {
    id: "L1",
    fecha: "2025-02-01",
    concepto: "Árbitraje partido Liga",
    partidoId: "3",
    partidoNombre: "Unicaja - Baskonia",
    importe: 85,
    estado: "pagado",
  },
  {
    id: "L2",
    fecha: "2025-01-30",
    concepto: "Árbitraje partido Liga",
    partidoId: "4",
    partidoNombre: "Gran Canaria - Joventut",
    importe: 85,
    estado: "pagado",
  },
  {
    id: "L3",
    fecha: "2025-02-15",
    concepto: "Árbitraje partido (pendiente)",
    partidoId: "1",
    partidoNombre: "CB Estudiantes - Real Madrid",
    importe: 90,
    estado: "pendiente",
  },
];

export const mockResumenMes: ResumenMes = {
  totalEuros: 170,
  mes: 2,
  anio: 2025,
  cantidadPartidos: 2,
  cantidadLiquidaciones: 2,
};
