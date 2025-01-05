import { Outlet } from "react-router-dom";

export function ProjectLayout() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Outlet />
    </div>
  );
}