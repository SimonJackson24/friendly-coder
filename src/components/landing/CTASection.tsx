import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Rocket, ArrowRight, Shield, Star } from "lucide-react";

export function CTASection() {
  const navigate = useNavigate();
  const session = useSession();

  const handleGetStarted = () => {
    if (session) {
      navigate("/assistant");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="container mx-auto px-4 py-20">
      <Card className="glass max-w-5xl mx-auto p-12 rounded-lg text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 animate-pulse" />
        <div className="relative z-10 space-y-8">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Star className="h-6 w-6" />
            <Star className="h-6 w-6" />
            <Star className="h-6 w-6" />
            <Star className="h-6 w-6" />
            <Star className="h-6 w-6" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold">
            Transform Your Development Process Today
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of enterprises and developers who are building the future with AI. 
            Experience the power of Claude-3 Opus, enterprise version control, and advanced 
            package management in one unified platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/20 transition-all duration-300 group"
            >
              Start Building For Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/contact")}
              className="text-lg px-8 py-6 hover:bg-white/10 transition-all duration-300"
            >
              Schedule Enterprise Demo
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 pt-8">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">Enterprise-ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              <span className="text-sm">Rapid deployment</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}