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
  Settings,
  Database,
  Cloud,
  AppWindow,
  Workflow,
  MessageSquare,
  Share2,
  Search,
  BarChart3
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
        "Custom API integrations"
      ]
    },
    {
      icon: Smartphone,
      title: "Native Android Apps",
      description: "Transform your web apps into high-performance native Android applications. Automated build process and Play Store deployment.",
      benefits: [
        "Native Android performance",
        "Automated build pipeline",
        "Play Store deployment",
        "Cross-platform compatibility"
      ]
    },
    {
      icon: Target,
      title: "AI Marketing Suite",
      description: "Revolutionary AI-powered marketing automation. Create, optimize, and manage campaigns across all major platforms.",
      benefits: [
        "Multi-platform campaign management",
        "AI-driven optimization",
        "Real-time performance tracking",
        "Automated A/B testing"
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
        "Intelligent debugging"
      ]
    },
    {
      icon: Database,
      title: "Database & Backend",
      description: "Built-in Supabase integration for powerful backend capabilities, including authentication, real-time data, and file storage.",
      benefits: [
        "User authentication & management",
        "Real-time database operations",
        "Secure file storage",
        "Row-level security"
      ]
    },
    {
      icon: AppWindow,
      title: "Progressive Web Apps",
      description: "Create modern, responsive web applications that work offline and can be installed on any device.",
      benefits: [
        "Offline functionality",
        "Cross-device compatibility",
        "App-like experience",
        "Instant updates"
      ]
    },
    {
      icon: Workflow,
      title: "CI/CD Pipeline",
      description: "Automated development workflow with integrated testing, building, and deployment capabilities.",
      benefits: [
        "Automated testing",
        "Continuous integration",
        "One-click deployment",
        "Version control"
      ]
    },
    {
      icon: MessageSquare,
      title: "Chat Interfaces",
      description: "Build sophisticated chat applications with real-time messaging, file sharing, and AI-powered responses.",
      benefits: [
        "Real-time messaging",
        "File attachments",
        "AI chat integration",
        "Custom chat UI"
      ]
    },
    {
      icon: Share2,
      title: "Social Features",
      description: "Implement social networking capabilities with user profiles, following systems, and activity feeds.",
      benefits: [
        "User profiles & connections",
        "Activity feeds",
        "Content sharing",
        "Social authentication"
      ]
    },
    {
      icon: Search,
      title: "Search & Discovery",
      description: "Powerful search functionality with filters, recommendations, and AI-powered content discovery.",
      benefits: [
        "Full-text search",
        "Advanced filtering",
        "AI recommendations",
        "Real-time results"
      ]
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive analytics with customizable dashboards, user tracking, and performance metrics.",
      benefits: [
        "User behavior tracking",
        "Performance metrics",
        "Custom reports",
        "Data visualization"
      ]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with advanced authentication, encryption, and compliance features built into every aspect.",
      benefits: [
        "End-to-end encryption",
        "Role-based access",
        "Compliance ready",
        "Security auditing"
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
            development tools and marketing automation for unparalleled results.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="glass p-8 rounded-lg space-y-4 hover:scale-105 transition-transform duration-300">
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