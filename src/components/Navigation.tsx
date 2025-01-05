/**
 * Copyright (c) 2024 AI Studio. All rights reserved.
 * 
 * This file is part of the proprietary software developed by the copyright holder.
 * 
 * This software uses the following open source packages under their respective licenses:
 * - React Router: MIT License (https://github.com/remix-run/react-router/blob/main/LICENSE.md)
 * - Lucide Icons: MIT License (https://github.com/lucide-icons/lucide/blob/main/LICENSE)
 * - shadcn/ui components: MIT License (https://github.com/shadcn/ui/blob/main/LICENSE.md)
 * - @supabase/auth-helpers-react: MIT License (https://github.com/supabase/auth-helpers/blob/main/LICENSE)
 * 
 * While these dependencies are open source, this file and its contents remain proprietary
 * and may not be copied, modified, or distributed without explicit permission.
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { BrainCog, Settings, LogOut, Megaphone, LayoutDashboard, MessageSquare, GraduationCap } from "lucide-react";
import { handleSignOut } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";

export const Navigation = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { success, error } = await handleSignOut();
    if (success) {
      navigate("/login");
    } else {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="border-b border-white/10 bg-black/75 backdrop-blur-md sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16 px-4 md:px-8 max-w-7xl mx-auto">
        <Link to="/" className="font-bold text-xl flex items-center gap-2 hover:opacity-80 transition-opacity">
          <BrainCog className="h-6 w-6 text-primary" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
            AI Studio
          </span>
        </Link>
        
        <div className="flex items-center gap-2 md:gap-4">
          {session ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" className="hover:bg-white/10">
                  <LayoutDashboard className="h-5 w-5 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/assistant">
                <Button variant="ghost" className="hover:bg-white/10">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  AI Assistant
                </Button>
              </Link>
              <Link to="/ads">
                <Button variant="ghost" className="hover:bg-white/10">
                  <Megaphone className="h-5 w-5 mr-2" />
                  AI Studio Ads
                </Button>
              </Link>
              <Link to="/learning">
                <Button variant="ghost" className="hover:bg-white/10">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Learning Hub
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                className="hover:bg-white/10 text-red-400 hover:text-red-300"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button 
              onClick={handleLogin}
              className="shadow-lg hover:shadow-primary/20 transition-all duration-300"
            >
              Sign in to AI Studio
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};