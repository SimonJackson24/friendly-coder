import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Navigation } from "./components/Navigation";
import { Toaster } from "./components/ui/toaster";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            <RouterProvider router={router} />
          </main>
          <Toaster />
        </div>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;