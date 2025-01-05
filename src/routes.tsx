import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProjectLayout } from "@/components/layout/ProjectLayout";
import { StudioLayout } from "@/modules/ai-studio/components/layout/StudioLayout";
import { ProjectSettings } from "@/components/ProjectSettings";
import { VersionControl } from "@/components/version-control/VersionControl";
import { IssueList } from "@/components/issues/IssueList";
import { LearningHub } from "@/pages/LearningHub";
import { TutorialDetail } from "@/components/learning/TutorialDetail";
import { LearningPaths } from "@/pages/LearningPaths";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/project/:id",
        element: <ProjectLayout />,
        children: [
          {
            path: "studio",
            element: <StudioLayout />
          },
          {
            path: "settings",
            element: <ProjectSettings />
          },
          {
            path: "version-control",
            element: <VersionControl />
          },
          {
            path: "issues",
            element: <IssueList />
          }
        ]
      },
      {
        path: "/learning",
        element: <LearningHub />
      },
      {
        path: "/tutorial/:id",
        element: <TutorialDetail />
      },
      {
        path: "/learning-paths",
        element: <LearningPaths />
      }
    ]
  }
];

export const router = createBrowserRouter(routes);
