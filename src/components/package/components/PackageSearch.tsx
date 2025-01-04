import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PackageSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedPackage: string | null;
  onInstall: () => void;
}

export function PackageSearch({ 
  searchTerm, 
  onSearchChange, 
  selectedPackage, 
  onInstall 
}: PackageSearchProps) {
  const { toast } = useToast();

  const handleSearch = async () => {
    try {
      // Save search history
      await supabase.from('search_history').insert({
        query: searchTerm,
        filters: { type: 'package' }
      });
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search packages..."
          value={searchTerm}
          onChange={(e) => {
            onSearchChange(e.target.value);
            handleSearch();
          }}
          className="pl-8"
        />
      </div>
      <Button onClick={onInstall} disabled={!selectedPackage}>
        <Plus className="w-4 h-4 mr-2" />
        Install
      </Button>
    </div>
  );
}