import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import Aziende from "./pages/Aziende";
import Dipendenti from "./pages/Dipendenti";
import ScadenzePage from "./pages/ScadenzePage";
import AttrezzaturePage from "./pages/AttrezzaturePage";
import CalendarioPage from "./pages/CalendarioPage";
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
          <Route path="/dipendenti" element={<Dipendenti />} />
          <Route path="/scadenze" element={<ScadenzePage />} />
          <Route path="/attrezzature" element={<AttrezzaturePage />} />
          <Route path="/calendario" element={<CalendarioPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
