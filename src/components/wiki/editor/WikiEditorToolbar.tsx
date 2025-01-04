import { Button } from "@/components/ui/button";
import { Save, History, Trash2, Eye, EyeOff } from "lucide-react";

interface WikiEditorToolbarProps {
  isPreviewMode: boolean;
  showHistory: boolean;
  isSaving: boolean;
  hasPageId: boolean;
  onTogglePreview: () => void;
  onToggleHistory: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export function WikiEditorToolbar({
  isPreviewMode,
  showHistory,
  isSaving,
  hasPageId,
  onTogglePreview,
  onToggleHistory,
  onSave,
  onDelete,
}: WikiEditorToolbarProps) {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Button variant="outline" onClick={onToggleHistory}>
          <History className="w-4 h-4 mr-2" />
          {showHistory ? "Hide History" : "View History"}
        </Button>
        <Button variant="outline" onClick={onTogglePreview}>
          {isPreviewMode ? (
            <><EyeOff className="w-4 h-4 mr-2" /> Edit</>
          ) : (
            <><Eye className="w-4 h-4 mr-2" /> Preview</>
          )}
        </Button>
        {hasPageId && (
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        )}
      </div>
      <Button onClick={onSave} disabled={isSaving}>
        <Save className="w-4 h-4 mr-2" />
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}