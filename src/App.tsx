import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import Aziende from "./pages/Aziende";
import AziendaProfiloPage from "./pages/AziendaProfiloPage";
import AziendaScadenzePubblicPage from "./pages/AziendaScadenzePubblicPage";
import Dipendenti from "./pages/Dipendenti";
import ScadenzePage from "./pages/ScadenzePage";
import AttrezzaturePage from "./pages/AttrezzaturePage";
import CalendarioPage from "./pages/CalendarioPage";
import FormazionePage from "./pages/FormazionePage";
import VisiteMedichePage from "./pages/VisiteMedichePage";
import VerifichePage from "./pages/VerifichePage";
import DocumentiPage from "./pages/DocumentiPage";
import CRMPage from "./pages/CRMPage";
import AmbientePage from "./pages/AmbientePage";
import ReportPage from "./pages/ReportPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/aziende" element={<Aziende />} />
          <Route path="/aziende/:id/scadenze" element={<AziendaScadenzePubblicPage />} />
          <Route path="/aziende/:id" element={<AziendaProfiloPage />} />
          <Route path="/dipendenti" element={<Dipendenti />} />
          <Route path="/scadenze" element={<ScadenzePage />} />
          <Route path="/attrezzature" element={<AttrezzaturePage />} />
          <Route path="/calendario" element={<CalendarioPage />} />
          <Route path="/formazione" element={<FormazionePage />} />
          <Route path="/visite-mediche" element={<VisiteMedichePage />} />
          <Route path="/verifiche" element={<VerifichePage />} />
          <Route path="/documenti" element={<DocumentiPage />} />
          <Route path="/ambiente" element={<AmbientePage />} />
          <Route path="/crm" element={<CRMPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
