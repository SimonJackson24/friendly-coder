import { Home, MessageSquare, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto">
        <div className="flex h-16 items-center gap-6">
          <Link
            to="/"
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive("/") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Home className="h-4 w-4" />
            Projects
          </Link>
          <Link
            to="/assistant"
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive("/assistant") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            AI Assistant
          </Link>
          <Link
            to="/settings"
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive("/settings") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
};