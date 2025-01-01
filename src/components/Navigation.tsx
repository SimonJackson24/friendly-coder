import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { BrainCog } from "lucide-react";

export const Navigation = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-bold text-xl flex items-center gap-2">
          <BrainCog className="h-6 w-6 text-primary" />
          <span>AI Studio</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link to="/assistant">
                <Button variant="ghost">Assistant</Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost">Settings</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={handleLogin}>Login with Supabase</Button>
          )}
        </div>
      </div>
    </nav>
  );
};