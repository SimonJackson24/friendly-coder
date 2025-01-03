import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export const LoginForm = () => {
  return (
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
  );
};