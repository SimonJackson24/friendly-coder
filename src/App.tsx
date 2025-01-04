import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Navigation } from "./components/Navigation";
import { Toaster } from "./components/ui/toaster";
import { SettingsProvider } from "./contexts/SettingsContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Assistant from "./pages/Assistant";
import Ads from "./pages/Ads";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <DndProvider backend={HTML5Backend}>
          <SettingsProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-black to-black/95 text-white">
                <Navigation />
                <main className="min-h-[calc(100vh-4rem)]">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/assistant" element={<Assistant />} />
                    <Route path="/ads" element={<Ads />} />
                  </Routes>
                </main>
                <Toaster />
              </div>
            </Router>
          </SettingsProvider>
        </DndProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
}

export default App;