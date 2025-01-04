import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WikiSearchProps {
  repositoryId: string;
  onSelectPage: (pageId: string) => void;
}

export function WikiSearch({ repositoryId, onSelectPage }: WikiSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const { data, error } = await supabase
        .from("wiki_pages")
        .select("id, title, content")
        .eq("repository_id", repositoryId)
        .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error("Error searching wiki pages:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search wiki pages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-2">
          {searchResults.map((page) => (
            <Button
              key={page.id}
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => onSelectPage(page.id)}
            >
              <div>
                <div className="font-medium">{page.title}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {page.content.substring(0, 100)}...
                </div>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}