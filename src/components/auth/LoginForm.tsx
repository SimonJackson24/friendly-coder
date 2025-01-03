import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const LoginForm = () => {
  const { toast } = useToast();

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-xl shadow-lg p-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>
      
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: 'rgb(99, 102, 241)',
                brandAccent: 'rgb(79, 70, 229)',
                inputBackground: 'transparent',
                inputText: 'white',
                inputBorder: 'rgba(255, 255, 255, 0.15)',
                inputBorderFocus: 'rgb(99, 102, 241)',
                inputBorderHover: 'rgba(255, 255, 255, 0.3)',
                messageText: 'rgba(255, 255, 255, 0.9)',
                messageTextDanger: 'rgb(239, 68, 68)',
              },
              borderWidths: {
                buttonBorderWidth: '1px',
                inputBorderWidth: '1px',
              },
              radii: {
                borderRadiusButton: '0.5rem',
                buttonBorderRadius: '0.5rem',
                inputBorderRadius: '0.5rem',
              },
            },
          },
          className: {
            container: 'auth-container',
            button: 'auth-button hover:opacity-90 transition-opacity',
            input: 'auth-input',
            label: 'auth-label text-sm font-medium text-foreground',
            message: 'auth-message text-sm',
          },
        }}
        providers={[]}
        redirectTo={`${window.location.origin}/`}
        onError={(error) => {
          console.error('Auth error:', error);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: error.message || "Failed to authenticate. Please try again.",
          });
        }}
        localization={{
          variables: {
            sign_in: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Sign In',
              loading_button_label: 'Signing in...',
              social_provider_text: 'Sign in with {{provider}}',
              link_text: "Don't have an account? Sign up",
            },
          },
        }}
        showLinks={true}
        view="sign_in"
      />

      <div className="text-center text-sm text-muted-foreground">
        <p>For testing, first create a new account with these credentials:</p>
        <p className="font-mono mt-1">Email: test@example.com</p>
        <p className="font-mono">Password: test123456</p>
      </div>
    </div>
  );
};