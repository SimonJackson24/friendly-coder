import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Assistant from "@/pages/Assistant";
import Ads from "@/pages/Ads";
import Settings from "@/pages/Settings";
import { Layout } from "@/components/Layout";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/assistant",
        element: <Assistant />,
      },
      {
        path: "/ads",
        element: <Ads />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
]);