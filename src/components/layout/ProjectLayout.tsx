import { Outlet } from "react-router-dom";

export function ProjectLayout() {
  return (
    <div className="h-screen">
      <Outlet />
    </div>
  );
}