import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Save, History, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pageHistory, setPageHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  // Load existing page content
  useEffect(() => {
    if (pageId) {
      loadPageContent();
    }
  }, [pageId]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (hasUnsavedChanges && title.trim() && content.trim()) {
        handleSave();
      }
    }, 30000); // Auto-save after 30 seconds of no changes

    return () => clearTimeout(autoSaveTimer);
  }, [title, content, hasUnsavedChanges]);

  // Prompt before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const loadPageContent = async () => {
    setIsLoading(true);
    try {
      const { data: page, error } = await supabase
        .from("wiki_pages")
        .select("*")
        .eq("id", pageId)
        .single();

      if (error) throw error;

      if (page) {
        setTitle(page.title);
        setContent(page.content);
        loadPageHistory();
      }
    } catch (error) {
      console.error("Error loading wiki page:", error);
      toast({
        title: "Error",
        description: "Failed to load wiki page content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadPageHistory = async () => {
    try {
      const { data: history, error } = await supabase
        .from("wiki_page_history")
        .select("*")
        .eq("page_id", pageId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPageHistory(history || []);
    } catch (error) {
      console.error("Error loading page history:", error);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    if (!session?.user?.id) {
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
        // Save current version to history
        await supabase
          .from("wiki_page_history")
          .insert({
            page_id: pageId,
            content: content,
            created_by: session.user.id,
          });

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
            created_by: session.user.id
          });

        if (error) throw error;
      }

      setHasUnsavedChanges(false);
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

  const handleDelete = async () => {
    if (!pageId) return;

    try {
      const { error } = await supabase
        .from("wiki_pages")
        .delete()
        .eq("id", pageId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Wiki page deleted successfully",
      });
      
      onSave?.();
    } catch (error) {
      console.error("Error deleting wiki page:", error);
      toast({
        title: "Error",
        description: "Failed to delete wiki page",
        variant: "destructive",
      });
    }
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    setHasUnsavedChanges(true);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setHasUnsavedChanges(true);
  };

  if (isLoading) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Page Title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        {isPreviewMode ? (
          <div className="prose min-h-[300px] p-4 border rounded-md">
            {content}
          </div>
        ) : (
          <Textarea
            placeholder="Write your content here..."
            className="min-h-[300px]"
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
          />
        )}
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="w-4 h-4 mr-2" />
            {showHistory ? "Hide History" : "View History"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? (
              <><EyeOff className="w-4 h-4 mr-2" /> Edit</>
            ) : (
              <><Eye className="w-4 h-4 mr-2" /> Preview</>
            )}
          </Button>
          {pageId && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

      {showHistory && pageHistory.length > 0 && (
        <div className="mt-4 border rounded-md p-4">
          <h3 className="text-lg font-semibold mb-2">Page History</h3>
          <div className="space-y-2">
            {pageHistory.map((revision) => (
              <div
                key={revision.id}
                className="p-2 border rounded hover:bg-accent cursor-pointer"
                onClick={() => setContent(revision.content)}
              >
                <p className="text-sm text-muted-foreground">
                  {new Date(revision.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the wiki page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}