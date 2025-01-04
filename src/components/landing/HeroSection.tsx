import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Award, ArrowRight } from "lucide-react";

export function HeroSection() {
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
    <section className="container mx-auto px-4 pt-20 pb-32">
      <div className="text-center max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
          <Award className="h-8 w-8 text-primary" />
          <span className="text-primary font-semibold">
            World's Most Advanced AI Development & Marketing Platform
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary/80 mb-6 leading-tight">
          Build Apps & Scale Your Business with Enterprise-Grade AI Technology
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          The only platform that combines AI-powered development, native Android apps, 
          and intelligent marketing automation. Build faster, scale smarter, and dominate your market.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/20 transition-all duration-300 w-full sm:w-auto group"
          >
            Start Building For Free
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate("/pricing")}
            className="text-lg px-8 py-6 hover:bg-white/10 transition-all duration-300 w-full sm:w-auto"
          >
            Enterprise Solutions
          </Button>
        </div>

        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-gray-400 max-w-4xl mx-auto">
          <div className="p-4 glass rounded-lg hover:scale-105 transition-transform">
            <div className="text-2xl font-bold text-white">100%</div>
            <div>AI-Powered</div>
          </div>
          <div className="p-4 glass rounded-lg hover:scale-105 transition-transform">
            <div className="text-2xl font-bold text-white">10x</div>
            <div>Faster Development</div>
          </div>
          <div className="p-4 glass rounded-lg hover:scale-105 transition-transform">
            <div className="text-2xl font-bold text-white">5+</div>
            <div>Ad Platforms</div>
          </div>
          <div className="p-4 glass rounded-lg hover:scale-105 transition-transform">
            <div className="text-2xl font-bold text-white">24/7</div>
            <div>AI Optimization</div>
          </div>
        </div>
      </div>
    </section>
  );
}