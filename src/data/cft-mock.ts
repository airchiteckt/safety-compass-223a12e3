export interface Affiliato {
  id: string;
  ragioneSociale: string;
  piva: string;
  indirizzo: string;
  referente: string;
  email: string;
  telefono: string;
  piano: "base" | "pro" | "enterprise";
  statoAbbonamento: "attivo" | "in_scadenza" | "scaduto" | "trial";
  dataAttivazione: string;
  scadenzaAbbonamento: string;
  feeMessile: number;
  aziendeAssegnateIds: string[];
  utenti: AffiliatoUtente[];
}

export interface AffiliatoUtente {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  ruolo: "admin" | "consulente" | "operatore";
  attivo: boolean;
}

export const pianoLabels: Record<Affiliato["piano"], string> = {
  base: "Base",
  pro: "Professional",
  enterprise: "Enterprise",
};

export const pianoColors: Record<Affiliato["piano"], string> = {
  base: "bg-muted text-muted-foreground",
  pro: "bg-primary/10 text-primary",
  enterprise: "bg-warning/10 text-warning",
};

export const statoAbbonamentoLabels: Record<Affiliato["statoAbbonamento"], string> = {
  attivo: "Attivo",
  in_scadenza: "In scadenza",
  scaduto: "Scaduto",
  trial: "Trial",
};

export const affiliati: Affiliato[] = [
  {
    id: "aff-1",
    ragioneSociale: "Pegaso S.r.l.",
    piva: "12345678901",
    indirizzo: "Via della Sicurezza 10, Roma (RM)",
    referente: "Dott. Marco Pegaso",
    email: "info@pegaso-sicurezza.it",
    telefono: "+39 06 1234567",
    piano: "enterprise",
    statoAbbonamento: "attivo",
    dataAttivazione: "2024-01-15",
    scadenzaAbbonamento: "2027-01-15",
    feeMessile: 490,
    aziendeAssegnateIds: ["1", "2", "5"],
    utenti: [
      { id: "u1", nome: "Marco", cognome: "Pegaso", email: "m.pegaso@pegaso-sicurezza.it", ruolo: "admin", attivo: true },
      { id: "u2", nome: "Elena", cognome: "Conti", email: "e.conti@pegaso-sicurezza.it", ruolo: "consulente", attivo: true },
      { id: "u3", nome: "Fabio", cognome: "De Luca", email: "f.deluca@pegaso-sicurezza.it", ruolo: "operatore", attivo: true },
    ],
  },
  {
    id: "aff-2",
    ragioneSociale: "Studio Gamma Consulting S.r.l.",
    piva: "98765432109",
    indirizzo: "Corso Europa 22, Milano (MI)",
    referente: "Ing. Laura Gamma",
    email: "info@studiogamma.it",
    telefono: "+39 02 9876543",
    piano: "pro",
    statoAbbonamento: "attivo",
    dataAttivazione: "2024-06-01",
    scadenzaAbbonamento: "2026-06-01",
    feeMessile: 290,
    aziendeAssegnateIds: ["3"],
    utenti: [
      { id: "u4", nome: "Laura", cognome: "Gamma", email: "l.gamma@studiogamma.it", ruolo: "admin", attivo: true },
      { id: "u5", nome: "Simone", cognome: "Bruni", email: "s.bruni@studiogamma.it", ruolo: "consulente", attivo: true },
    ],
  },
  {
    id: "aff-3",
    ragioneSociale: "Associazione Delta Sicurezza",
    piva: "45678901234",
    indirizzo: "Piazza Libertà 5, Bologna (BO)",
    referente: "Dott.ssa Chiara Delta",
    email: "info@deltasicurezza.it",
    telefono: "+39 051 4567890",
    piano: "base",
    statoAbbonamento: "in_scadenza",
    dataAttivazione: "2025-01-01",
    scadenzaAbbonamento: "2026-01-01",
    feeMessile: 150,
    aziendeAssegnateIds: ["4"],
    utenti: [
      { id: "u6", nome: "Chiara", cognome: "Delta", email: "c.delta@deltasicurezza.it", ruolo: "admin", attivo: true },
    ],
  },
  {
    id: "aff-4",
    ragioneSociale: "SafeWork Partners S.p.A.",
    piva: "11223344556",
    indirizzo: "Via Industriale 18, Torino (TO)",
    referente: "Ing. Roberto Mancini",
    email: "info@safeworkpartners.it",
    telefono: "+39 011 1122334",
    piano: "pro",
    statoAbbonamento: "trial",
    dataAttivazione: "2026-03-01",
    scadenzaAbbonamento: "2026-04-01",
    feeMessile: 290,
    aziendeAssegnateIds: [],
    utenti: [
      { id: "u7", nome: "Roberto", cognome: "Mancini", email: "r.mancini@safeworkpartners.it", ruolo: "admin", attivo: true },
    ],
  },
];
