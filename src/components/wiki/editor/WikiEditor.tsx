import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { WikiEditorToolbar } from "./WikiEditorToolbar";
import { WikiPageHistory } from "./WikiPageHistory";
import { WikiDeleteDialog } from "./WikiDeleteDialog";
import ReactMarkdown from 'react-markdown';

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
  onSave,
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

  useEffect(() => {
    if (pageId) {
      loadPageContent();
    }
  }, [pageId]);

  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (hasUnsavedChanges && title.trim() && content.trim()) {
        handleSave();
      }
    }, 30000);

    return () => clearTimeout(autoSaveTimer);
  }, [title, content, hasUnsavedChanges]);

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
        await supabase
          .from("wiki_page_history")
          .insert({
            page_id: pageId,
            content: content,
            created_by: session.user.id,
          });

        const { error } = await supabase
          .from("wiki_pages")
          .update({
            title,
            content,
            updated_at: new Date().toISOString(),
          })
          .eq("id", pageId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("wiki_pages")
          .insert({
            repository_id: repositoryId,
            title,
            content,
            created_by: session.user.id,
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
          onChange={(e) => {
            setTitle(e.target.value);
            setHasUnsavedChanges(true);
          }}
        />
      </div>

      <div className="space-y-2">
        {isPreviewMode ? (
          <div className="prose prose-invert min-h-[300px] p-4 border rounded-md">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <Textarea
            placeholder="Write your content here... (Markdown supported)"
            className="min-h-[300px]"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setHasUnsavedChanges(true);
            }}
          />
        )}
      </div>

      <WikiEditorToolbar
        isPreviewMode={isPreviewMode}
        showHistory={showHistory}
        isSaving={isSaving}
        hasPageId={!!pageId}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        onToggleHistory={() => setShowHistory(!showHistory)}
        onSave={handleSave}
        onDelete={() => setShowDeleteDialog(true)}
      />

      {showHistory && (
        <WikiPageHistory
          history={pageHistory}
          onSelectVersion={setContent}
        />
      )}

      <WikiDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={handleDelete}
      />
    </Card>
  );
}