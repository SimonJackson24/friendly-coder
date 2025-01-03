import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Navigation } from "./components/Navigation";
import { Toaster } from "./components/ui/toaster";
import { SettingsProvider } from "./contexts/SettingsContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Assistant from "./pages/Assistant";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
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
                </Routes>
              </main>
              <Toaster />
            </div>
          </Router>
        </SettingsProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
}

export default App;