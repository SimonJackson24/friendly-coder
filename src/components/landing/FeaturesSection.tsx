import { Card } from "@/components/ui/card";
import { 
  BrainCog, 
  Smartphone, 
  Target, 
  Rocket,
  Shield,
  Database,
  Cloud,
  AppWindow,
  Workflow,
  MessageSquare,
  Share2,
  Search,
  BarChart3,
  Bot
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: BrainCog,
      title: "Advanced AI Development",
      description: "Enterprise-grade AI that understands your business needs. Generate full-stack applications with real-time preview and intelligent code optimization.",
      benefits: [
        "Full-stack web apps with real-time preview",
        "Intelligent code optimization & debugging",
        "AI-powered component generation",
        "Custom API integrations",
        "Automated testing & validation"
      ]
    },
    {
      icon: Smartphone,
      title: "Native Android Apps",
      description: "Transform your web apps into high-performance native Android applications with automated build process and Play Store deployment.",
      benefits: [
        "Native Android performance",
        "Automated build pipeline",
        "Play Store deployment",
        "Cross-platform compatibility",
        "Real-time testing environment"
      ]
    },
    {
      icon: Bot,
      title: "Claude AI Integration",
      description: "Powered by Claude-3 Opus, the most advanced AI model for understanding and generating human-like content and code.",
      benefits: [
        "Advanced context understanding",
        "Natural language processing",
        "Code generation & analysis",
        "Intelligent debugging",
        "Automated documentation"
      ]
    },
    {
      icon: Database,
      title: "Enterprise Database",
      description: "Built-in Supabase integration for powerful backend capabilities, including real-time data, authentication, and file storage.",
      benefits: [
        "Real-time database operations",
        "User authentication & management",
        "Secure file storage",
        "Row-level security",
        "Automated backups"
      ]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with advanced authentication, encryption, and compliance features built into every aspect.",
      benefits: [
        "End-to-end encryption",
        "Role-based access control",
        "Compliance ready",
        "Security auditing",
        "Automated vulnerability scanning"
      ]
    },
    {
      icon: Cloud,
      title: "Automated DevOps",
      description: "Streamlined deployment and scaling with integrated CI/CD pipeline and cloud infrastructure management.",
      benefits: [
        "One-click deployment",
        "Automated scaling",
        "Performance monitoring",
        "Infrastructure as code",
        "Zero-downtime updates"
      ]
    },
    {
      icon: Workflow,
      title: "Version Control",
      description: "Advanced version control system with automated changelog generation and rollback capabilities.",
      benefits: [
        "Automated changelogs",
        "Impact analysis",
        "Safe rollbacks",
        "Branch management",
        "Conflict resolution"
      ]
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive analytics with customizable dashboards, user tracking, and performance metrics.",
      benefits: [
        "Real-time metrics",
        "Custom reports",
        "User behavior tracking",
        "Performance analysis",
        "Data visualization"
      ]
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
            development tools and enterprise security for unparalleled results.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="glass p-8 rounded-lg space-y-4 hover:scale-105 transition-transform">
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
              <ul className="space-y-3 text-gray-300">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
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