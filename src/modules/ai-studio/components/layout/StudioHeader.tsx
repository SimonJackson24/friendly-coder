import { BrainCog } from "lucide-react";

interface StudioHeaderProps {
  projectTitle?: string;
}

export function StudioHeader({ projectTitle }: StudioHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <BrainCog className="h-8 w-8 text-primary" />
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
          {projectTitle ? `${projectTitle} - AI Studio` : "AI Studio"}
        </h1>
        <p className="text-white/80 mt-1">
          Build smarter with AI
        </p>
      </div>
    </div>
  );
}