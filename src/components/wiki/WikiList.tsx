import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WikiPage {
  id: string;
  title: string;
  created_at: string;
}

interface WikiListProps {
  repositoryId: string;
  onSelectPage: (pageId: string) => void;
  onCreateNew: () => void;
}

export function WikiList({ repositoryId, onSelectPage, onCreateNew }: WikiListProps) {
  const [pages, setPages] = useState<WikiPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPages();
  }, [repositoryId]);

  const loadPages = async () => {
    try {
      const { data, error } = await supabase
        .from("wiki_pages")
        .select("id, title, created_at")
        .eq("repository_id", repositoryId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error("Error loading wiki pages:", error);
      toast({
        title: "Error",
        description: "Failed to load wiki pages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading wiki pages...</div>;
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Wiki Pages</h3>
        <Button onClick={onCreateNew} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Page
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {pages.map((page) => (
            <Button
              key={page.id}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => onSelectPage(page.id)}
            >
              <FileText className="w-4 h-4 mr-2" />
              {page.title}
            </Button>
          ))}
          {pages.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No wiki pages yet
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}