import { Route, Routes as RouterRoutes } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Assistant from "./pages/Assistant";
import Ads from "./pages/Ads";

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/assistant" element={<Assistant />} />
      <Route path="/ads" element={<Ads />} />
    </RouterRoutes>
  );
}