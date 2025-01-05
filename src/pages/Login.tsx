import { Button } from "@/components/ui/button";
import { BrainCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

export default function Login() {
  const navigate = useNavigate();
  const session = useSession();

  const handleLogin = () => {
    if (session) {
      navigate("/assistant");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="text-center">
          <BrainCog className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-bold">Welcome to AI Studio</h2>
          <p className="mt-2 text-gray-400">
            Sign in to start building smarter applications
          </p>
        </div>
        <div className="space-y-4">
          <Button onClick={handleLogin} className="w-full">
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
