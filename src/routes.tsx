import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Settings from "./pages/Settings";
import LearningHub from "./pages/LearningHub";
import { LearningPathDetail } from "./components/learning/paths/LearningPathDetail";

export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
      {
        path: "/projects/:id",
        element: <ProjectDetail />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/learning",
        element: <LearningHub />,
        children: [
          {
            path: "paths/:id",
            element: <LearningPathDetail />,
          }
        ]
      },
    ],
  },
];

export const router = createBrowserRouter(routes);