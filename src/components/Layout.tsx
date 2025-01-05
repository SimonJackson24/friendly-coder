import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Suspense fallback={
          <div className="flex items-center justify-center h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}