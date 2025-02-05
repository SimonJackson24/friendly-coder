import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Assistant from "@/pages/Assistant";
import Ads from "@/pages/Ads";
import Settings from "@/pages/Settings";
import LearningHub from "@/pages/LearningHub";
import { Layout } from "@/components/Layout";
import { VersionControl } from "@/components/version-control/VersionControl";
import { PackageManager } from "@/components/package/PackageManager";
import { TeamCollaboration } from "@/components/team/TeamCollaboration";
import { TutorialDetail } from "@/components/learning/TutorialDetail";

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
      {
        path: "/learning",
        element: <LearningHub />,
      },
      {
        path: "/tutorial/:id",
        element: <TutorialDetail />,
      },
      {
        path: "/version-control",
        element: <VersionControl projectId={null} />,
      },
      {
        path: "/packages",
        element: <PackageManager />,
      },
      {
        path: "/team",
        element: <TeamCollaboration />,
      },
    ],
  },
]);