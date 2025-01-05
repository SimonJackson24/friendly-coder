import { useState } from "react";
import { ProjectTypeCard } from "./ProjectTypeCard";
import { DeploymentCard } from "./DeploymentCard";
import { 
  Globe, 
  Workflow, 
  Smartphone, 
  ArrowRightLeft,
  GitBranch,
  Package,
  Users,
  Settings
} from "lucide-react";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { useSession } from "@supabase/auth-helpers-react";

export function QuickActions() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const session = useSession();

  const projectTypes = [
    {
      title: "Responsive Website with PWA",
      description: "Create a modern, responsive website with Progressive Web App capabilities",
      icon: Globe,
      color: "text-blue-500",
      onClick: () => setIsCreateOpen(true)
    },
    {
      title: "Full Stack Web Application",
      description: "Build a complete application with frontend, backend, and database",
      icon: Workflow,
      color: "text-purple-500",
      onClick: () => setIsCreateOpen(true)
    },
    {
      title: "Android App",
      description: "Develop a native Android application from scratch",
      icon: Smartphone,
      color: "text-green-500",
      onClick: () => setIsCreateOpen(true)
    },
    {
      title: "Convert Web App to Android",
      description: "Convert your web application into a native Android app",
      icon: ArrowRightLeft,
      color: "text-orange-500",
      onClick: () => setIsCreateOpen(true)
    },
    {
      title: "Version Control",
      description: "Manage your code with Git-based version control",
      icon: GitBranch,
      color: "text-indigo-500",
      route: "/version-control"
    },
    {
      title: "Package Management",
      description: "Manage and publish packages for your projects",
      icon: Package,
      color: "text-pink-500",
      route: "/packages"
    },
    {
      title: "Team Collaboration",
      description: "Work together with your team members",
      icon: Users,
      color: "text-teal-500",
      route: "/team"
    },
    {
      title: "Project Settings",
      description: "Configure your project settings and preferences",
      icon: Settings,
      color: "text-gray-500",
      route: "/settings"
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DeploymentCard />
        {projectTypes.map((type) => (
          <ProjectTypeCard key={type.title} {...type} />
        ))}
      </div>

      {session && (
        <CreateProjectDialog 
          isOpen={isCreateOpen} 
          onOpenChange={setIsCreateOpen}
          userId={session.user.id}
        />
      )}
    </div>
  );
}