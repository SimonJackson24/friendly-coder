import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
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

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome back!",
          description: "Successfully logged in",
        });
        navigate("/");
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been logged out",
        });
      } else if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Password Recovery",
          description: "Check your email for password reset instructions",
        });
      } else if (event === 'USER_UPDATED') {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        });
      } else if (event === 'INITIAL_SESSION') {
        if (session) {
          toast({
            title: "Welcome!",
            description: "Successfully signed in",
          });
          navigate("/");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container max-w-md mx-auto p-4">
        <div className="bg-card rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#000000',
                    brandAccent: '#333333',
                  }
                }
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
              }
            }}
            providers={[]}
            redirectTo={window.location.origin}
            showLinks={true}
            view="sign_in"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;