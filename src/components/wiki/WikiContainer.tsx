import { useState } from "react";
import { WikiEditor } from "./WikiEditor";
import { WikiList } from "./WikiList";

interface WikiContainerProps {
  repositoryId: string;
}

export function WikiContainer({ repositoryId }: WikiContainerProps) {
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const handleSelectPage = (pageId: string) => {
    setSelectedPageId(pageId);
    setIsCreatingNew(false);
  };

  const handleCreateNew = () => {
    setSelectedPageId(null);
    setIsCreatingNew(true);
  };

  const handleSave = () => {
    setIsCreatingNew(false);
    setSelectedPageId(null);
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-3">
        <WikiList
          repositoryId={repositoryId}
          onSelectPage={handleSelectPage}
          onCreateNew={handleCreateNew}
        />
      </div>
      <div className="col-span-12 md:col-span-9">
        {(selectedPageId || isCreatingNew) ? (
          <WikiEditor
            repositoryId={repositoryId}
            pageId={selectedPageId || undefined}
            onSave={handleSave}
          />
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            Select a page to view or create a new one
          </div>
        )}
      </div>
    </div>
  );
}