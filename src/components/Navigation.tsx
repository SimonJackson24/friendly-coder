import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";

export const Navigation = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-bold text-xl">
          Project Manager
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
          ) : null}
        </div>
      </div>
    </nav>
  );
};