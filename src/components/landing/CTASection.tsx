import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Rocket, ArrowRight } from "lucide-react";

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
      <Card className="glass max-w-4xl mx-auto p-12 rounded-lg text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 animate-pulse" />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Building Your Next Big Thing
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers and businesses who are creating the future with AI.
            Get started today and experience the power of true automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              Contact Enterprise Sales
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}