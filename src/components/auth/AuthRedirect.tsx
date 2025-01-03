import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

export const AuthRedirect = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Session state:", session);
    if (session) {
      console.log("User is logged in, redirecting to home");
      navigate("/");
    }
  }, [session, navigate]);

  return null;
};