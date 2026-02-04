const FBIB_ESB_BASE = "https://esb.optimalwayconsulting.com";

export interface FitxaPartitMatch {
  idMatch: string;
  idLocalTeam?: string | null;
  idVisitorTeam?: string | null;
  matchDay: string;
  nameLocalTeam: string;
  nameVisitorTeam: string;
  nameCategory: string;
  nameCompetition: string;
  nameField: string | null;
  addressField: string | null;
  postalCodeField: string | null;
  nameTown: string | null;
  localClubLogo?: string | null;
  visitorClubLogo?: string | null;
  numMatchDay?: string | null;
  nameGroup?: string | null;
  /** Resultado: cuando existen, el partido ya se ha jugado */
  localScore?: string | number | null;
  visitorScore?: string | number | null;
  [key: string]: unknown;
}

export interface FitxaPartitDesignation {
  designationId: string;
  refereeRole: string;
  refereeName: string;
  refereeSurname: string;
  [key: string]: unknown;
}

export interface FitxaPartitStandingEntry {
  idStanding?: string;
  idTeam?: string;
  position: string;
  teamName: string;
  matchPlayed: string;
  matchWin: string;
  matchLost: string;
  standingScore: string;
  entityLogo?: string | null;
  [key: string]: unknown;
}

export interface FitxaPartitResponse {
  result: string;
  errorCode: number;
  message: string;
  messageData?: {
    match: FitxaPartitMatch;
    designations?: FitxaPartitDesignation[];
    standing?: FitxaPartitStandingEntry[];
    group?: { nameGroup?: string; [key: string]: unknown };
    controlDesignations?: { start?: { valor?: string }; end?: { valor?: string }; [key: string]: unknown };
    [key: string]: unknown;
  };
}

/**
 * Obtiene la ficha de un partido desde el ESB FBIB (fitxaPartit).
 * GET https://esb.optimalwayconsulting.com/fbib/1/{token}/FCBQWeb/fitxaPartit/{matchId}
 * Requiere PUBLIC_TOKEN_FBIB en las variables de entorno.
 */
export async function getMatchDetail(matchId: string): Promise<FitxaPartitResponse> {
  const token = (process.env.PUBLIC_TOKEN_FBIB ?? "").trim();
  if (!token) {
    throw new Error("PUBLIC_TOKEN_FBIB no configurado");
  }
  const url = `${FBIB_ESB_BASE}/fbib/1/${token}/FCBQWeb/fitxaPartit/${matchId}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`fitxaPartit error ${res.status}: ${text || res.statusText}`);
  }
  const raw = await res.text();
  let data: FitxaPartitResponse;
  try {
    data = JSON.parse(raw) as FitxaPartitResponse;
  } catch {
    // La API a veces devuelve el JSON codificado en base64
    try {
      const decoded = Buffer.from(raw, "base64").toString("utf-8");
      data = JSON.parse(decoded) as FitxaPartitResponse;
    } catch (e) {
      throw new Error(`fitxaPartit: respuesta no es JSON válido (¿base64?): ${raw.slice(0, 50)}...`);
    }
  }
  if (data.result !== "OK" || data.errorCode !== 0) {
    throw new Error(data.message || "Error en la respuesta de fitxaPartit");
  }
  return data;
}
