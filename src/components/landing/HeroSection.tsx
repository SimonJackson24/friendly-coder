import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Award, ArrowRight, Code, Shield, Database, ChartBarIcon, BrainCog, Megaphone } from "lucide-react";

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
      description: "Claude-3 Opus integration"
    },
    {
      value: "10x",
      label: "Faster Development",
      description: "Than traditional methods"
    },
    {
      value: "99.9%",
      label: "Uptime",
      description: "Enterprise reliability"
    },
    {
      value: "500+",
      label: "Enterprise Features",
      description: "Built-in capabilities"
    }
  ];

  const capabilities = [
    "Full-stack Applications",
    "AI Ad Studio",
    "Cross-Platform Ad Management",
    "Advanced Analytics",
    "Enterprise Security",
    "Advanced Version Control",
    "Package Management",
    "Team Collaboration",
    "Automated DevOps",
    "Performance Optimization",
    "Real-time Analytics",
    "AI-powered Development",
    "Multi-Platform Integration",
    "Campaign Management",
    "Ad Performance Tracking"
  ];

  return (
    <section className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 pointer-events-none" />

      <div className="container mx-auto px-4 py-32 relative">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Award className="h-8 w-8 text-primary" />
            <span className="text-primary font-semibold bg-primary/10 px-6 py-2 rounded-full">
              World's Most Advanced AI Development & Ad Management Platform
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary/80 leading-tight">
            Build & Promote Enterprise Applications with AI Studio
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 text-center max-w-3xl mx-auto">
            The only platform that combines Claude-3 Opus AI, enterprise-grade version control, 
            advanced package management, AI-powered ad creation, and bank-grade security in one powerful solution.
          </p>

          <div className="flex justify-center gap-8 my-8">
            <div className="flex flex-col items-center gap-2">
              <BrainCog className="h-8 w-8 text-primary" />
              <span className="text-sm">AI Development</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Megaphone className="h-8 w-8 text-primary" />
              <span className="text-sm">Ad Management</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-sm">Enterprise Security</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center my-16">
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

          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold mb-8">Enterprise-Grade Development & Ad Platform</h2>
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="p-8 glass rounded-lg hover:scale-105 transition-transform">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-gray-400">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 border-t border-gray-800">
        <div className="flex flex-wrap justify-center items-center gap-12">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-sm">Bank-Grade Security</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            <span className="text-sm">Enterprise Infrastructure</span>
          </div>
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="text-sm">Advanced Version Control</span>
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
