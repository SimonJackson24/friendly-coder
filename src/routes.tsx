import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Assistant from "@/pages/Assistant";
import Settings from "@/pages/Settings";
import Ads from "@/pages/Ads";
import Dashboard from "@/pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/assistant",
    element: <Assistant />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/ads",
    element: <Ads />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);