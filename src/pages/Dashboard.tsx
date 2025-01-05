import { useSession } from "@supabase/auth-helpers-react";
import { Navigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  BrainCog, 
  Megaphone, 
  GitBranch, 
  Package, 
  Users,
  Settings,
  Boxes
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const session = useSession();
  const { toast } = useToast();

  if (!session) {
    return <Navigate to="/login" />;
  }

  const features = [
    {
      title: "AI Studio",
      description: "Build and deploy AI-powered applications with real-time assistance",
      icon: BrainCog,
      href: "/assistant",
      color: "text-purple-500"
    },
    {
      title: "Ad Manager",
      description: "Create and optimize ad campaigns with AI-driven insights",
      icon: Megaphone,
      href: "/ads",
      color: "text-blue-500"
    },
    {
      title: "Version Control",
      description: "Manage code versions, branches, and collaborations",
      icon: GitBranch,
      color: "text-green-500",
      href: "/version-control"
    },
    {
      title: "Package Manager",
      description: "Manage dependencies and publish packages",
      icon: Package,
      color: "text-orange-500",
      href: "/packages"
    },
    {
      title: "Team Collaboration",
      description: "Work together with your team in real-time",
      icon: Users,
      color: "text-pink-500",
      href: "/team"
    },
    {
      title: "Project Settings",
      description: "Configure your project settings and integrations",
      icon: Settings,
      color: "text-gray-500",
      href: "/settings"
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {session.user.email}
          </p>
        </div>
        <Button asChild>
          <Link to="/assistant">
            <BrainCog className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link key={feature.title} to={feature.href}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start space-x-4">
                <div className={`${feature.color} p-3 rounded-lg bg-background group-hover:bg-secondary`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-purple-100 text-purple-500">
                <BrainCog className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">New AI Project Created</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-blue-100 text-blue-500">
                <Megaphone className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Ad Campaign Updated</p>
                <p className="text-sm text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-green-100 text-green-500">
                <GitBranch className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">New Branch Created</p>
                <p className="text-sm text-muted-foreground">Yesterday</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}