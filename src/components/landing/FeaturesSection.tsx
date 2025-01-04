import { Card } from "@/components/ui/card";
import { 
  BrainCog, 
  Smartphone, 
  Target, 
  Rocket,
  Shield,
  ChartBarIcon,
  DollarSign,
  Code,
  Bot,
  Zap,
  LineChart,
  Settings
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: BrainCog,
      title: "Advanced AI Development",
      description: "Enterprise-grade AI that understands your business needs. Generate full-stack applications with real-time preview and intelligent code optimization.",
      benefits: ["Full-stack web apps", "Real-time preview", "Code optimization"]
    },
    {
      icon: Smartphone,
      title: "Native Android Apps",
      description: "Transform your web apps into high-performance native Android applications. Automated build process and Play Store deployment.",
      benefits: ["Native performance", "Automated builds", "Play Store ready"]
    },
    {
      icon: Target,
      title: "AI Marketing Suite",
      description: "Revolutionary AI-powered marketing automation. Create, optimize, and manage campaigns across all major platforms.",
      benefits: ["Multi-platform", "AI optimization", "Real-time analytics"]
    },
    {
      icon: Bot,
      title: "Claude AI Integration",
      description: "Powered by Claude-3 Opus, the most advanced AI model for understanding and generating human-like content and code.",
      benefits: ["Advanced AI model", "Context awareness", "Natural language"]
    },
    {
      icon: LineChart,
      title: "Performance Analytics",
      description: "Deep insights into both application performance and marketing campaigns. Make data-driven decisions with AI recommendations.",
      benefits: ["Real-time metrics", "AI insights", "ROI tracking"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with advanced authentication, encryption, and compliance features built into every aspect of the platform.",
      benefits: ["End-to-end encryption", "Role-based access", "Compliance ready"]
    }
  ];

  return (
    <section className="bg-black/40 backdrop-blur-sm py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Rocket className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Enterprise-Grade AI Technology
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our cutting-edge platform combines advanced AI models with industry-leading 
            development tools and marketing automation for unparalleled results.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="glass p-8 rounded-lg space-y-4 hover:scale-105 transition-transform">
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
              <ul className="space-y-3 text-gray-300">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/20 p-1 mt-1">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}