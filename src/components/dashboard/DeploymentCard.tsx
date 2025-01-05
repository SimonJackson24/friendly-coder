import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { Link } from "react-router-dom";

export function DeploymentCard() {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="text-blue-500 p-3 rounded-lg bg-background">
          <Rocket className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold">Quick Deploy</h3>
          <p className="text-sm text-muted-foreground">
            Deploy your project to Vercel, Netlify, or Cloudflare
          </p>
          <Button asChild variant="link" className="p-0">
            <Link to="/dashboard?tab=deployment">
              Deploy Now →
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}