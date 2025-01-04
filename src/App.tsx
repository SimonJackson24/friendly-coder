import { BrowserRouter } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SettingsProvider } from "./contexts/SettingsContext";
import { ProjectProvider } from "./contexts/ProjectContext";
import { supabase } from "./integrations/supabase/client";
import { Routes } from "./routes";

const queryClient = new QueryClient();

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <DndProvider backend={HTML5Backend}>
          <SettingsProvider>
            <ProjectProvider>
              <BrowserRouter>
                <main className="min-h-screen bg-background">
                  <Routes />
                </main>
              </BrowserRouter>
            </ProjectProvider>
          </SettingsProvider>
        </DndProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
}

export default App;