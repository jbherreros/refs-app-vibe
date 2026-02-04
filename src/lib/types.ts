export type EstadoPartido = "pendiente" | "finalizado";

export interface Partido {
  id: string;
  fecha: string; // ISO date
  hora: string; // HH:mm
  equipoLocal: string;
  equipoVisitante: string;
  lugar: string;
  estado: EstadoPartido;
}

export interface Liquidacion {
  id: string;
  fecha: string; // ISO date
  concepto: string;
  partidoId?: string;
  partidoNombre?: string;
  importe: number;
  estado: "pagado" | "pendiente";
}

export interface ResumenMes {
  totalEuros: number;
  mes: number;
  anio: number;
  cantidadPartidos?: number;
  cantidadLiquidaciones?: number;
}

export interface Usuario {
  id: string;
  email: string;
  nombre?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  accessToken?: string;
}

/** Respuesta de GET /auth/my-referee/personal-data */
export interface RefereePersonalData {
  id: number;
  nif: string | null;
  refereeNumber: number;
  name: string;
  alias: string | null;
  lastName: string;
  userId: string | null;
  uuid: string | null;
  address: string | null;
  postalCode: string | null;
  townName: string | null;
  townNewId: number | null;
  phoneParticular: string | null;
  phoneWork: string | null;
  phoneMobile: string | null;
  phoneOther: string | null;
  phoneFax: string | null;
  email: string;
  birthDate: string | null;
  birthTown: string | null;
  active: boolean;
  territorialCode: number | null;
  territorialName: string | null;
  dischargeDate: string | null;
  studies: string | null;
  profession: string | null;
  gender: number | null;
  enabled: boolean;
  isReferee: boolean;
  isCoach: boolean;
  tshirtSize: string | null;
  trousersSize: string | null;
  lastUpdate: string | null;
  categoryName: string | null;
  [key: string]: unknown;
}

/** Item de GET /auth/my-referee/preliquidation/weekly */
export interface PreliquidationWeeklyItem {
  liquidationId: number;
  matchId: number;
  matchDate: string;
  formattedMatchDate: string;
  conceptLiteral: string;
  conceptDescription?: string;
  categoryName: string | null;
  localTeamName: string | null;
  visitorTeamName: string | null;
  grossAmount: number;
  irpfRetentionAmount: number;
  netAmount: number;
  exemptAmount?: number;
  status: number;
  initialDate?: string;
  finalDate?: string;
  formattedInitialDate?: string;
  formattedFinalDate?: string;
  [key: string]: unknown;
}

/** Item de GET /auth/my-referee/designations/my-matches (partidos de la semana) */
export interface MyMatchDesignation {
  matchId: number;
  matchCallId: number;
  designationId: number;
  matchDay: string;
  formattedMatchDay: string | null;
  localTeamName: string;
  visitorTeamName: string;
  installationName: string | null;
  installationAddress: string | null;
  town: string | null;
  refereeFunctionName: string | null;
  refereeFunctionNameShort: string | null;
  categoryName: string | null;
  competitionName: string | null;
  roundNumber?: number | null;
  [key: string]: unknown;
}

/** Item de GET /auth/my-referee/payments/not-pending (histórico de pagos) */
export interface PaymentNotPending {
  idPayment: number;
  initialControlDate: string;
  finalControlDate: string;
  controlState: number;
  idReferee: number;
  paymentState: number;
  grosAmount: number;
  amountHoldingIRPF: number;
  netAmount: number;
  clearedAmount: number;
  toPayAmount: number;
  [key: string]: unknown;
}

/** Item de designación en GET /auth/my-referee/designations/status (downloaded / pending) */
export interface DesignationStatusItem {
  matchId: number | null;
  matchCallId: number | null;
  designationId: number | null;
  localTeamName: string | null;
  visitorTeamName: string | null;
  installationId: number | null;
  installationName: string | null;
  installationAddress: string | null;
  town: string | null;
  matchDay: string | null;
  formattedMatchDay: string | null;
  timeZone: string | null;
  categoryName: string | null;
  competitionName: string | null;
  refereeFunctionNameShort: string | null;
  [key: string]: unknown;
}

/** Respuesta de GET /auth/my-referee/designations/status */
export interface DesignationsStatus {
  downloaded: DesignationStatusItem[];
  refused: unknown[];
  pending: DesignationStatusItem[];
  substitutions: unknown[];
}
