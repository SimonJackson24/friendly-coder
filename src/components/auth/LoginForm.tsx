import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export const LoginForm = () => {
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
        redirectTo={window.location.origin}
        showLinks={true}
        view="sign_in"
      />
    </div>
  );
};