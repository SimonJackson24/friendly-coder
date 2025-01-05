import { Card } from "@/components/ui/card";
import { 
  BrainCog, 
  Target, 
  Rocket,
  Shield,
  Database,
  Cloud,
  Workflow,
  MessageSquare,
  Share2,
  Search,
  BarChart3,
  Bot,
  GitBranch,
  History,
  Lock,
  PackageCheck,
  Users,
  Zap,
  Megaphone,
  LineChart,
  LayoutDashboard,
  Settings,
  Globe
} from "lucide-react";

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
    icon: Megaphone,
    title: "AI Ad Studio",
    description: "Revolutionary AI-powered ad creation and management platform. Create, optimize, and manage ads across multiple platforms with intelligent insights.",
    benefits: [
      "Multi-platform ad management",
      "AI-generated ad content",
      "Performance analytics",
      "A/B testing automation",
      "Campaign optimization"
    ]
  },
  {
    icon: Bot,
    title: "Claude-3 Opus Integration",
    description: "Powered by the latest Claude-3 Opus model, offering unparalleled understanding of complex development requirements and natural language processing.",
    benefits: [
      "Advanced context understanding",
      "Sophisticated code generation",
      "Intelligent debugging assistance",
      "Natural language requirements processing",
      "Automated documentation generation"
    ]
  },
  {
    icon: LineChart,
    title: "Advanced Analytics",
    description: "Comprehensive analytics suite for tracking ad performance, user engagement, and campaign effectiveness across all platforms.",
    benefits: [
      "Real-time performance tracking",
      "Cross-platform analytics",
      "Custom report generation",
      "ROI analysis",
      "Audience insights"
    ]
  },
  {
    icon: GitBranch,
    title: "Advanced Version Control",
    description: "Enterprise-grade version control with automated changelog generation, smart conflict resolution, and comprehensive code review systems.",
    benefits: [
      "Automated changelog generation",
      "Smart merge conflict resolution",
      "Pull request management",
      "Code review workflow",
      "Branch protection rules"
    ]
  },
  {
    icon: History,
    title: "Rollback & Recovery",
    description: "Comprehensive rollback capabilities with impact analysis and automated validation to ensure system stability during version changes.",
    benefits: [
      "One-click rollbacks",
      "Impact analysis visualization",
      "Automated validation checks",
      "Version comparison tools",
      "Recovery automation"
    ]
  },
  {
    icon: Lock,
    title: "Enterprise Permissions",
    description: "Sophisticated permission management system with visual hierarchy, template-based controls, and bulk operations support.",
    benefits: [
      "Visual permission hierarchy",
      "Role-based access control",
      "Permission templates",
      "Bulk operations",
      "Audit logging"
    ]
  },
  {
    icon: PackageCheck,
    title: "Package Management",
    description: "Advanced package management with dependency resolution, automated publishing workflows, and comprehensive version tracking.",
    benefits: [
      "Automated dependency resolution",
      "Smart version management",
      "Publishing workflows",
      "Package security scanning",
      "Distribution controls"
    ]
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with advanced authentication, encryption, and compliance features built into every aspect of the platform.",
    benefits: [
      "End-to-end encryption",
      "Role-based access control",
      "Compliance ready",
      "Security auditing",
      "Vulnerability scanning"
    ]
  },
  {
    icon: Cloud,
    title: "Automated DevOps",
    description: "Streamlined deployment and scaling with integrated CI/CD pipeline and intelligent infrastructure management.",
    benefits: [
      "One-click deployment",
      "Automated scaling",
      "Performance monitoring",
      "Infrastructure as code",
      "Zero-downtime updates"
    ]
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Enhanced team collaboration features with real-time updates, commenting systems, and integrated communication tools.",
    benefits: [
      "Real-time collaboration",
      "Team permissions",
      "Comment threads",
      "Activity tracking",
      "Team analytics"
    ]
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Built-in performance optimization tools with automated analysis and recommendations for improving application speed.",
    benefits: [
      "Automated performance analysis",
      "Optimization recommendations",
      "Load testing tools",
      "Performance monitoring",
      "Resource optimization"
    ]
  },
  {
    icon: LayoutDashboard,
    title: "Campaign Management",
    description: "Comprehensive campaign management tools for planning, executing, and monitoring advertising campaigns across multiple platforms.",
    benefits: [
      "Multi-platform campaign planning",
      "Budget optimization",
      "Audience targeting",
      "Schedule management",
      "Performance tracking"
    ]
  },
  {
    icon: Globe,
    title: "Multi-Platform Integration",
    description: "Seamless integration with major advertising platforms including Facebook, Google, LinkedIn, and more.",
    benefits: [
      "One-click platform connection",
      "Unified dashboard",
      "Cross-platform optimization",
      "Automated data sync",
      "Centralized management"
    ]
  }
];

export function FeaturesSection() {
  return (
    <section className="bg-black/40 backdrop-blur-sm py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Rocket className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Enterprise-Grade AI Technology & Ad Management
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our cutting-edge platform combines advanced AI models with industry-leading 
            development tools, ad management capabilities, and enterprise security for unparalleled results.
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