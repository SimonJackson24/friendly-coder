import { LoginForm } from "@/components/auth/LoginForm";
import { AuthRedirect } from "@/components/auth/AuthRedirect";
import { AuthStateListener } from "@/components/auth/AuthStateListener";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container max-w-md mx-auto p-4">
        <LoginForm />
        <AuthRedirect />
        <AuthStateListener />
      </div>
    </div>
  );
};

export default Login;