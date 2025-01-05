import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthRedirect } from "@/components/auth/AuthRedirect";
import { AuthStateListener } from "@/components/auth/AuthStateListener";
import { useSession } from "@supabase/auth-helpers-react";

const Login = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      console.log("User already logged in, redirecting to dashboard");
      navigate("/dashboard");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 bg-background/50">
      <div className="w-full">
        <LoginForm />
        <AuthStateListener />
      </div>
    </div>
  );
};

export default Login;