import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Award, ArrowRight, Code, Smartphone, Rocket, Shield, Database, ChartBarIcon } from "lucide-react";

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

  const stats = [
    {
      value: "100%",
      label: "AI-Powered",
      description: "Full AI automation"
    },
    {
      value: "10x",
      label: "Faster Development",
      description: "Than traditional methods"
    },
    {
      value: "24/7",
      label: "Intelligent Optimization",
      description: "Continuous improvement"
    },
    {
      value: "100+",
      label: "Enterprise Features",
      description: "Built-in capabilities"
    }
  ];

  const capabilities = [
    "Full-stack web applications",
    "Native Android apps",
    "AI-powered marketing",
    "Real-time analytics",
    "Enterprise security",
    "Automated deployment",
    "Version control",
    "Team collaboration"
  ];

  return (
    <section className="relative">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 pointer-events-none" />

      {/* Main Hero Content */}
      <div className="container mx-auto px-4 pt-24 pb-16 relative">
        <div className="text-center max-w-5xl mx-auto space-y-6">
          {/* Award Badge */}
          <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
            <Award className="h-8 w-8 text-primary" />
            <span className="text-primary font-semibold bg-primary/10 px-4 py-2 rounded-full">
              World's Most Advanced AI Development Platform
            </span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary/80 mb-6 leading-tight">
            Build Enterprise-Grade Applications with Advanced AI Technology
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            The only platform that combines AI-powered development, native Android apps, 
            intelligent marketing automation, and enterprise-grade security in one powerful solution.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
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
              View Enterprise Solutions
            </Button>
          </div>

          {/* Platform Capabilities */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold mb-6">Build Anything You Can Imagine</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {capabilities.map((capability, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white/5 rounded-full text-sm text-gray-300 hover:bg-primary/20 transition-colors"
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 glass rounded-lg hover:scale-105 transition-transform">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-gray-400">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="container mx-auto px-4 py-12 border-t border-gray-800">
        <div className="flex flex-wrap justify-center items-center gap-8">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-sm">Enterprise-Grade Security</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            <span className="text-sm">Scalable Infrastructure</span>
          </div>
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="text-sm">Clean Code Generation</span>
          </div>
          <div className="flex items-center gap-2">
            <ChartBarIcon className="h-6 w-6 text-primary" />
            <span className="text-sm">Real-Time Analytics</span>
          </div>
        </div>
      </div>
    </section>
  );
}