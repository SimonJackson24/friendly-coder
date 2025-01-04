import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, History, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PackageSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedPackage: string | null;
  onInstall: () => void;
}

interface SearchHistoryItem {
  id: string;
  query: string;
  filters: {
    category?: string;
    tags?: string[];
  };
  created_at: string;
}

export function PackageSearch({ 
  searchTerm, 
  onSearchChange, 
  selectedPackage, 
  onInstall 
}: PackageSearchProps) {
  const { toast } = useToast();
  const [category, setCategory] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const categories = [
    "All",
    "UI Components",
    "State Management",
    "Data Fetching",
    "Utilities",
    "Testing",
  ];

  const availableTags = [
    "react",
    "typescript",
    "frontend",
    "backend",
    "database",
    "api",
    "styling",
    "animation",
  ];

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      const { data: historyData, error } = await supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setSearchHistory(historyData || []);
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };

  const saveSearchHistory = async () => {
    if (!searchTerm.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('User not authenticated, skipping search history');
        return;
      }

      const searchData = {
        query: searchTerm,
        filters: {
          category: category || undefined,
          tags: selectedTags.length > 0 ? selectedTags : undefined,
        },
        user_id: user.id,
      };

      const { error } = await supabase
        .from('search_history')
        .insert([searchData]);

      if (error) throw error;
      
      fetchSearchHistory();
    } catch (error) {
      console.error('Error saving search history:', error);
      toast({
        title: "Error",
        description: "Failed to save search history",
        variant: "destructive",
      });
    }
  };

  const handleSearch = () => {
    saveSearchHistory();
    // Additional search logic here
  };

  const applyHistoryItem = (item: SearchHistoryItem) => {
    onSearchChange(item.query);
    if (item.filters.category) {
      setCategory(item.filters.category);
    }
    if (item.filters.tags) {
      setSelectedTags(item.filters.tags);
    }
    setShowHistory(false);
  };

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={onInstall} disabled={!selectedPackage}>
          <Plus className="w-4 h-4 mr-2" />
          Install
        </Button>
      </div>

      <div className="flex gap-2 items-center">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat.toLowerCase()}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
            </Badge>
          ))}
        </div>
      </div>

      {showHistory && searchHistory.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg p-2">
          <div className="text-sm font-medium mb-2">Recent Searches</div>
          {searchHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-2 hover:bg-accent rounded-sm cursor-pointer"
              onClick={() => applyHistoryItem(item)}
            >
              <History className="h-4 w-4 text-muted-foreground" />
              <span>{item.query}</span>
              {item.filters.tags && item.filters.tags.length > 0 && (
                <div className="flex gap-1">
                  {item.filters.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {availableTags
          .filter(tag => !selectedTags.includes(tag))
          .map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="cursor-pointer hover:bg-accent"
              onClick={() => addTag(tag)}
            >
              + {tag}
            </Badge>
          ))}
      </div>
    </div>
  );
}