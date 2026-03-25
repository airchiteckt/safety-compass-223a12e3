import { AppLayout } from "@/components/AppLayout";
import {
  LayoutDashboard, Building2, Users, Wrench, CalendarClock, GraduationCap,
  Stethoscope, FileText, ClipboardCheck, Calendar, Briefcase, Leaf, BarChart3,
  Globe, Shield, CreditCard, UserPlus, Settings, Bell, Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  accent?: string;
}

function FeatureCard({ icon: Icon, title, description, accent }: FeatureCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex gap-4">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accent || "bg-primary/10 text-primary"}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const erpFeatures: FeatureCardProps[] = [
  { icon: LayoutDashboard, title: "Dashboard", description: "Panoramica in tempo reale su scadenze, conformità e stato generale di tutte le aziende gestite." },
  { icon: Building2, title: "Anagrafica Aziende", description: "Gestione completa dei dati aziendali, sedi operative, referenti e documentazione associata." },
  { icon: Users, title: "Gestione Dipendenti", description: "Anagrafica dipendenti con mansioni, formazione, idoneità sanitarie e scadenze individuali." },
  { icon: Wrench, title: "Attrezzature", description: "Registro attrezzature di lavoro con scadenze di verifica, manutenzione e conformità CE." },
  { icon: CalendarClock, title: "Scadenzario", description: "Monitoraggio centralizzato di tutte le scadenze normative con alert automatici e stato di avanzamento." },
  { icon: GraduationCap, title: "Formazione", description: "Pianificazione corsi obbligatori, tracciamento attestati, scadenze aggiornamenti e storico formativo." },
  { icon: Stethoscope, title: "Visite Mediche", description: "Gestione protocollo sanitario, scadenze visite periodiche, idoneità e giudizi del medico competente." },
  { icon: ClipboardCheck, title: "Verifiche Impianti", description: "Registro verifiche periodiche di impianti elettrici, messa a terra, apparecchi a pressione e ascensori." },
  { icon: Leaf, title: "Sicurezza Ambientale", description: "Gestione adempimenti ambientali: emissioni, scarichi, rifiuti, AUA e autorizzazioni ambientali." },
  { icon: FileText, title: "Archivio Documenti", description: "Repository centralizzato per DVR, DUVRI, POS, procedure, istruzioni operative e modulistica." },
  { icon: Calendar, title: "Calendario", description: "Vista calendario con tutte le scadenze, corsi, visite e verifiche programmate." },
  { icon: BarChart3, title: "Report & Export", description: "Generazione report di conformità, statistiche scadenze e export dati in PDF/Excel." },
  { icon: Briefcase, title: "CRM Commerciale", description: "Gestione lead, preventivi e pipeline commerciale per l'acquisizione di nuove aziende clienti." },
];

const cftFeatures: FeatureCardProps[] = [
  { icon: Globe, title: "Dashboard CFT", description: "Visione d'insieme su tutti gli affiliati: KPI, MRR, stato abbonamenti e aziende gestite.", accent: "bg-accent/50 text-accent-foreground" },
  { icon: Building2, title: "Gestione Affiliati", description: "Anagrafica completa degli affiliati con ragione sociale, P.IVA, contatti e referenti.", accent: "bg-accent/50 text-accent-foreground" },
  { icon: CreditCard, title: "Piani & Abbonamenti", description: "Monitoraggio piani attivi (Starter, Professional, Enterprise), stato pagamenti e scadenze rinnovi.", accent: "bg-accent/50 text-accent-foreground" },
  { icon: UserPlus, title: "Utenti Autorizzati", description: "Gestione degli utenti abilitati per ogni affiliato con ruoli (Admin, Consulente, Operatore).", accent: "bg-accent/50 text-accent-foreground" },
  { icon: Settings, title: "Configurazione Moduli", description: "Attivazione e disattivazione dei moduli ERP & SGSL disponibili per ciascun affiliato.", accent: "bg-accent/50 text-accent-foreground" },
  { icon: Bell, title: "Notifiche & Alert", description: "Sistema di notifiche centralizzato per scadenze abbonamenti, anomalie e richieste di supporto.", accent: "bg-accent/50 text-accent-foreground" },
  { icon: Lock, title: "Controllo Accessi", description: "Gestione permessi multi-livello: Super Admin CFT, Admin Affiliato, Consulente, Cliente.", accent: "bg-accent/50 text-accent-foreground" },
  { icon: BarChart3, title: "Report Globali", description: "Analisi aggregate su tutti gli affiliati: revenue, crescita, compliance rate e trend.", accent: "bg-accent/50 text-accent-foreground" },
];

export default function FunzionalitaPage() {
  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Funzionalità della Piattaforma
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Pegaso ERP & SGSL è una piattaforma SaaS multi-tenant per la gestione della sicurezza sul lavoro e conformità normativa, strutturata su tre livelli: <strong>CFT</strong> (Centro Federato Tecnico), <strong>Affiliati</strong> (società di consulenza) e <strong>Aziende Clienti</strong>.
        </p>
      </div>

      <Tabs defaultValue="erp" className="space-y-6">
        <TabsList>
          <TabsTrigger value="erp" className="gap-2">
            <Shield className="h-4 w-4" />
            ERP & SGSL
          </TabsTrigger>
          <TabsTrigger value="cft" className="gap-2">
            <Globe className="h-4 w-4" />
            Pannello CFT
          </TabsTrigger>
        </TabsList>

        <TabsContent value="erp">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Moduli ERP & SGSL</h2>
            <p className="text-sm text-muted-foreground">
              Tutti gli strumenti a disposizione di ogni affiliato per gestire la sicurezza e la conformità delle aziende clienti.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {erpFeatures.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cft">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Pannello CFT — Centro Federato Tecnico</h2>
            <p className="text-sm text-muted-foreground">
              Funzionalità riservate al Super Admin per la gestione centralizzata degli affiliati e della piattaforma.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cftFeatures.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
