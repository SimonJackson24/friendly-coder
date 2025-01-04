import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Save, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@supabase/auth-helpers-react";

interface WikiEditorProps {
  repositoryId: string;
  pageId?: string;
  initialTitle?: string;
  initialContent?: string;
  onSave?: () => void;
}

export function WikiEditor({ 
  repositoryId, 
  pageId, 
  initialTitle = "", 
  initialContent = "",
  onSave 
}: WikiEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    if (!auth?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to save wiki pages",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (pageId) {
        // Update existing page
        const { error } = await supabase
          .from("wiki_pages")
          .update({ 
            title, 
            content,
            updated_at: new Date().toISOString()
          })
          .eq("id", pageId);

        if (error) throw error;
      } else {
        // Create new page
        const { error } = await supabase
          .from("wiki_pages")
          .insert({
            repository_id: repositoryId,
            title,
            content,
            created_by: auth.user.id
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Wiki page saved successfully",
      });
      
      onSave?.();
    } catch (error) {
      console.error("Error saving wiki page:", error);
      toast({
        title: "Error",
        description: "Failed to save wiki page",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Page Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Textarea
          placeholder="Write your content here..."
          className="min-h-[300px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline">
          <History className="w-4 h-4 mr-2" />
          View History
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </Card>
  );
}