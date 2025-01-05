import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "./components/ui/toaster";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Initialize Supabase client with the values from supabase/client.ts
const supabase = createClient(
  "https://jpiqubhwpoqukqapsstp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwaXF1Ymh3cG9xdWtxYXBzc3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3MjQxNTksImV4cCI6MjA1MTMwMDE1OX0._TZ6yjGrQiTEnz0FQceXyH_x1WqxCMgUsHVuyrRBArc"
);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <div className="min-h-screen flex flex-col">
          <RouterProvider router={router} />
          <Toaster />
        </div>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;