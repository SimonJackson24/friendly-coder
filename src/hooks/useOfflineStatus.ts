/**
 * Copyright (c) 2024. All Rights Reserved.
 * 
 * This file is part of the proprietary software developed by the copyright holder.
 * 
 * This software uses the following open source packages under their respective licenses:
 * - shadcn/ui toast component: MIT License (https://github.com/shadcn/ui/blob/main/LICENSE.md)
 * 
 * While these dependencies are open source, this file and its contents remain proprietary
 * and may not be copied, modified, or distributed without explicit permission.
 */

import { useEffect } from "react";
import { useToast } from "./use-toast";

export function useOfflineStatus() {
  const { toast } = useToast();
  
  useEffect(() => {
    const handleOffline = () => {
      toast({
        title: "You're offline",
        description: "Some features may be limited",
        variant: "destructive",
      });
    };
    
    const handleOnline = () => {
      toast({
        title: "You're back online",
        description: "All features are now available",
      });
    };
    
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [toast]);
}
