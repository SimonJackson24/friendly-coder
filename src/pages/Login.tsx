import { LoginForm } from "@/components/auth/LoginForm";
import { AuthRedirect } from "@/components/auth/AuthRedirect";
import { AuthStateListener } from "@/components/auth/AuthStateListener";

const Login = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 bg-background/50">
      <div className="w-full">
        <LoginForm />
        <AuthRedirect />
        <AuthStateListener />
      </div>
    </div>
  );
};

export default Login;