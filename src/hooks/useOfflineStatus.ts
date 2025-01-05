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