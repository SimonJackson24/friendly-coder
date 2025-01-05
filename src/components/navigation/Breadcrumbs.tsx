import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);
  
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      <Link 
        to="/" 
        className="flex items-center hover:text-foreground transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {paths.map((path, index) => (
        <div key={path} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link
            to={`/${paths.slice(0, index + 1).join('/')}`}
            className="hover:text-foreground transition-colors capitalize"
            aria-current={index === paths.length - 1 ? "page" : undefined}
          >
            {path.replace(/-/g, ' ')}
          </Link>
        </div>
      ))}
    </nav>
  );
}
