export interface Azienda {
  id: string;
  ragioneSociale: string;
  piva: string;
  codiceAteco: string;
  indirizzo: string;
  numeroDipendenti: number;
  rischio: "basso" | "medio" | "alto";
  referente: string;
  email: string;
  telefono: string;
  rspp: string;
  medicoCompetente: string;
  complianceScore: number;
  status: "ok" | "in_scadenza" | "scaduto";
  partner: string;
}

export interface Dipendente {
  id: string;
  nome: string;
  cognome: string;
  codiceFiscale: string;
  mansione: string;
  reparto: string;
  dataAssunzione: string;
  tipoContratto: string;
  idoneitaSanitaria: "ok" | "in_scadenza" | "scaduto";
  aziendaId: string;
  azienda: string;
  formazione: { corso: string; status: "ok" | "in_scadenza" | "scaduto"; scadenza: string }[];
}

export interface Scadenza {
  id: string;
  tipo: "formazione" | "visita_medica" | "documento" | "verifica_impianto" | "ambiente";
  elemento: string;
  azienda: string;
  riferimento: string;
  scadenza: string;
  status: "ok" | "in_scadenza" | "scaduto";
}

export interface Attrezzatura {
  id: string;
  tipo: string;
  matricola: string;
  azienda: string;
  aziendaId: string;
  dataInstallazione: string;
  ultimaVerifica: string;
  prossimaVerifica: string;
  enteVerificatore: string;
  status: "ok" | "in_scadenza" | "scaduto";
}

export const aziende: Azienda[] = [
  {
    id: "1",
    ragioneSociale: "Rossi Costruzioni S.r.l.",
    piva: "01234567890",
    codiceAteco: "41.20.00",
    indirizzo: "Via Roma 15, Milano (MI)",
    numeroDipendenti: 45,
    rischio: "alto",
    referente: "Marco Rossi",
    email: "m.rossi@rossicostruzioni.it",
    telefono: "+39 02 1234567",
    rspp: "Ing. Bianchi",
    medicoCompetente: "Dott. Verdi",
    complianceScore: 92,
    status: "ok",
    partner: "Studio Gamma",
  },
  {
    id: "2",
    ragioneSociale: "TechnoMetal S.p.A.",
    piva: "09876543210",
    codiceAteco: "25.11.00",
    indirizzo: "Via Industria 8, Brescia (BS)",
    numeroDipendenti: 120,
    rischio: "alto",
    referente: "Laura Neri",
    email: "l.neri@technometal.it",
    telefono: "+39 030 9876543",
    rspp: "Ing. Colombo",
    medicoCompetente: "Dott.ssa Fontana",
    complianceScore: 67,
    status: "in_scadenza",
    partner: "Studio Gamma",
  },
  {
    id: "3",
    ragioneSociale: "Green Office S.r.l.",
    piva: "05678901234",
    codiceAteco: "82.11.01",
    indirizzo: "Corso Italia 42, Torino (TO)",
    numeroDipendenti: 18,
    rischio: "basso",
    referente: "Anna Bianchi",
    email: "a.bianchi@greenoffice.it",
    telefono: "+39 011 5678901",
    rspp: "Geom. Russo",
    medicoCompetente: "Dott. Esposito",
    complianceScore: 100,
    status: "ok",
    partner: "Associazione Delta",
  },
  {
    id: "4",
    ragioneSociale: "Alimentari Sole S.r.l.",
    piva: "03456789012",
    codiceAteco: "10.71.10",
    indirizzo: "Via Garibaldi 22, Bologna (BO)",
    numeroDipendenti: 32,
    rischio: "medio",
    referente: "Giuseppe Sole",
    email: "g.sole@alimentarisole.it",
    telefono: "+39 051 3456789",
    rspp: "Ing. Moretti",
    medicoCompetente: "Dott.ssa Ricci",
    complianceScore: 45,
    status: "scaduto",
    partner: "Associazione Delta",
  },
  {
    id: "5",
    ragioneSociale: "Logistica Rapida S.r.l.",
    piva: "07890123456",
    codiceAteco: "52.29.10",
    indirizzo: "Via dei Trasporti 5, Verona (VR)",
    numeroDipendenti: 65,
    rischio: "medio",
    referente: "Paolo Ferrari",
    email: "p.ferrari@logisticarapida.it",
    telefono: "+39 045 7890123",
    rspp: "Ing. Galli",
    medicoCompetente: "Dott. Marchetti",
    complianceScore: 78,
    status: "in_scadenza",
    partner: "Studio Gamma",
  },
];

export const dipendenti: Dipendente[] = [
  {
    id: "1",
    nome: "Mario",
    cognome: "Rossi",
    codiceFiscale: "RSSMRA80A01H501Z",
    mansione: "Operaio specializzato",
    reparto: "Produzione",
    dataAssunzione: "2019-03-15",
    tipoContratto: "Indeterminato",
    idoneitaSanitaria: "ok",
    aziendaId: "1",
    azienda: "Rossi Costruzioni S.r.l.",
    formazione: [
      { corso: "Sicurezza base", status: "ok", scadenza: "2026-03-15" },
      { corso: "Aggiornamento sicurezza", status: "in_scadenza", scadenza: "2026-04-15" },
      { corso: "Antincendio", status: "ok", scadenza: "2027-01-10" },
    ],
  },
  {
    id: "2",
    nome: "Giulia",
    cognome: "Bianchi",
    codiceFiscale: "BNCGLI85B41F205P",
    mansione: "Impiegata amministrativa",
    reparto: "Amministrazione",
    dataAssunzione: "2020-06-01",
    tipoContratto: "Indeterminato",
    idoneitaSanitaria: "ok",
    aziendaId: "1",
    azienda: "Rossi Costruzioni S.r.l.",
    formazione: [
      { corso: "Sicurezza base", status: "ok", scadenza: "2026-06-01" },
      { corso: "Primo soccorso", status: "scaduto", scadenza: "2025-12-01" },
    ],
  },
  {
    id: "3",
    nome: "Luca",
    cognome: "Verdi",
    codiceFiscale: "VRDLCU78C15L219Q",
    mansione: "Carpentiere",
    reparto: "Cantiere",
    dataAssunzione: "2018-09-01",
    tipoContratto: "Indeterminato",
    idoneitaSanitaria: "in_scadenza",
    aziendaId: "2",
    azienda: "TechnoMetal S.p.A.",
    formazione: [
      { corso: "Sicurezza base", status: "ok", scadenza: "2026-09-01" },
      { corso: "Lavori in quota", status: "scaduto", scadenza: "2025-08-15" },
      { corso: "Carrellista", status: "in_scadenza", scadenza: "2026-04-01" },
    ],
  },
  {
    id: "4",
    nome: "Sara",
    cognome: "Neri",
    codiceFiscale: "NRESRA90D55G702X",
    mansione: "Responsabile qualità",
    reparto: "Qualità",
    dataAssunzione: "2021-01-15",
    tipoContratto: "Indeterminato",
    idoneitaSanitaria: "ok",
    aziendaId: "3",
    azienda: "Green Office S.r.l.",
    formazione: [
      { corso: "Sicurezza base", status: "ok", scadenza: "2027-01-15" },
      { corso: "Antincendio", status: "ok", scadenza: "2027-05-20" },
    ],
  },
  {
    id: "5",
    nome: "Andrea",
    cognome: "Colombo",
    codiceFiscale: "CLMNDR82E20F205Y",
    mansione: "Magazziniere",
    reparto: "Logistica",
    dataAssunzione: "2017-04-10",
    tipoContratto: "Indeterminato",
    idoneitaSanitaria: "scaduto",
    aziendaId: "5",
    azienda: "Logistica Rapida S.r.l.",
    formazione: [
      { corso: "Sicurezza base", status: "scaduto", scadenza: "2025-04-10" },
      { corso: "Carrellista", status: "scaduto", scadenza: "2025-06-01" },
      { corso: "Primo soccorso", status: "ok", scadenza: "2027-02-15" },
    ],
  },
];

export const scadenze: Scadenza[] = [
  { id: "1", tipo: "formazione", elemento: "Aggiornamento sicurezza", azienda: "Rossi Costruzioni S.r.l.", riferimento: "Mario Rossi", scadenza: "2026-04-15", status: "in_scadenza" },
  { id: "2", tipo: "formazione", elemento: "Primo soccorso", azienda: "Rossi Costruzioni S.r.l.", riferimento: "Giulia Bianchi", scadenza: "2025-12-01", status: "scaduto" },
  { id: "3", tipo: "formazione", elemento: "Lavori in quota", azienda: "TechnoMetal S.p.A.", riferimento: "Luca Verdi", scadenza: "2025-08-15", status: "scaduto" },
  { id: "4", tipo: "visita_medica", elemento: "Visita periodica", azienda: "TechnoMetal S.p.A.", riferimento: "Luca Verdi", scadenza: "2026-05-01", status: "in_scadenza" },
  { id: "5", tipo: "documento", elemento: "DVR", azienda: "Alimentari Sole S.r.l.", riferimento: "Documento aziendale", scadenza: "2025-06-30", status: "scaduto" },
  { id: "6", tipo: "documento", elemento: "Piano emergenza", azienda: "Alimentari Sole S.r.l.", riferimento: "Documento aziendale", scadenza: "2025-09-15", status: "scaduto" },
  { id: "7", tipo: "verifica_impianto", elemento: "Impianto elettrico", azienda: "TechnoMetal S.p.A.", riferimento: "Matricola IE-2019-001", scadenza: "2026-06-01", status: "in_scadenza" },
  { id: "8", tipo: "formazione", elemento: "Sicurezza base", azienda: "Logistica Rapida S.r.l.", riferimento: "Andrea Colombo", scadenza: "2025-04-10", status: "scaduto" },
  { id: "9", tipo: "formazione", elemento: "Carrellista", azienda: "Logistica Rapida S.r.l.", riferimento: "Andrea Colombo", scadenza: "2025-06-01", status: "scaduto" },
  { id: "10", tipo: "visita_medica", elemento: "Visita periodica", azienda: "Logistica Rapida S.r.l.", riferimento: "Andrea Colombo", scadenza: "2025-03-01", status: "scaduto" },
  { id: "11", tipo: "verifica_impianto", elemento: "Estintori", azienda: "Green Office S.r.l.", riferimento: "Matricola EX-2020-015", scadenza: "2026-11-20", status: "ok" },
  { id: "12", tipo: "documento", elemento: "DUVRI", azienda: "Rossi Costruzioni S.r.l.", riferimento: "Documento aziendale", scadenza: "2026-12-01", status: "ok" },
  { id: "13", tipo: "ambiente", elemento: "AUA – Autorizzazione Unica Ambientale", azienda: "TechnoMetal S.p.A.", riferimento: "Prot. AUA-2022-456", scadenza: "2026-05-15", status: "in_scadenza" },
  { id: "14", tipo: "ambiente", elemento: "MUD – Dichiarazione rifiuti", azienda: "TechnoMetal S.p.A.", riferimento: "Dichiarazione annuale", scadenza: "2026-04-30", status: "in_scadenza" },
  { id: "15", tipo: "ambiente", elemento: "Registro carico/scarico rifiuti", azienda: "Alimentari Sole S.r.l.", riferimento: "Registro aziendale", scadenza: "2025-07-01", status: "scaduto" },
  { id: "16", tipo: "ambiente", elemento: "Analisi emissioni in atmosfera", azienda: "TechnoMetal S.p.A.", riferimento: "Camino E1", scadenza: "2025-10-15", status: "scaduto" },
  { id: "17", tipo: "ambiente", elemento: "Analisi scarichi idrici", azienda: "Alimentari Sole S.r.l.", riferimento: "Punto scarico S1", scadenza: "2026-08-01", status: "ok" },
];

export const attrezzature: Attrezzatura[] = [
  { id: "1", tipo: "Carrello elevatore", matricola: "CE-2018-001", azienda: "Rossi Costruzioni S.r.l.", aziendaId: "1", dataInstallazione: "2018-03-10", ultimaVerifica: "2025-03-10", prossimaVerifica: "2026-03-10", enteVerificatore: "INAIL", status: "ok" },
  { id: "2", tipo: "Impianto elettrico", matricola: "IE-2019-001", azienda: "TechnoMetal S.p.A.", aziendaId: "2", dataInstallazione: "2019-01-15", ultimaVerifica: "2024-06-01", prossimaVerifica: "2026-06-01", enteVerificatore: "ASL Brescia", status: "in_scadenza" },
  { id: "3", tipo: "Compressore", matricola: "CO-2020-003", azienda: "TechnoMetal S.p.A.", aziendaId: "2", dataInstallazione: "2020-05-20", ultimaVerifica: "2024-11-20", prossimaVerifica: "2026-11-20", enteVerificatore: "ARPA", status: "ok" },
  { id: "4", tipo: "Estintori", matricola: "EX-2020-015", azienda: "Green Office S.r.l.", aziendaId: "3", dataInstallazione: "2020-11-01", ultimaVerifica: "2025-05-20", prossimaVerifica: "2026-11-20", enteVerificatore: "Tecnico abilitato", status: "ok" },
  { id: "5", tipo: "Macchina utensile", matricola: "MU-2017-008", azienda: "Alimentari Sole S.r.l.", aziendaId: "4", dataInstallazione: "2017-07-12", ultimaVerifica: "2024-01-15", prossimaVerifica: "2025-01-15", enteVerificatore: "INAIL", status: "scaduto" },
];

export const tipoScadenzaLabels: Record<string, string> = {
  formazione: "Formazione",
  visita_medica: "Visita Medica",
  documento: "Documento",
  verifica_impianto: "Verifica Impianto",
  ambiente: "Ambiente",
};
