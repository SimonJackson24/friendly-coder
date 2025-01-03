import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AuthStateListener = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      switch (event) {
        case 'SIGNED_IN':
          toast({
            title: "Welcome back!",
            description: "Successfully logged in",
          });
          navigate("/");
          break;
        case 'SIGNED_OUT':
          toast({
            title: "Signed out",
            description: "You have been logged out",
          });
          break;
        case 'PASSWORD_RECOVERY':
          toast({
            title: "Password Recovery",
            description: "Check your email for password reset instructions",
          });
          break;
        case 'USER_UPDATED':
          toast({
            title: "Profile Updated",
            description: "Your profile has been updated successfully",
          });
          break;
        case 'INITIAL_SESSION':
          if (session) {
            toast({
              title: "Welcome!",
              description: "Successfully signed in",
            });
            navigate("/");
          }
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return null;
};