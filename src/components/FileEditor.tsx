/**
 * Copyright (c) 2024 AI Studio. All rights reserved.
 * 
 * This file is part of the proprietary software developed by the copyright holder.
 * 
 * This software uses the following open source packages under their respective licenses:
 * - Monaco Editor: MIT License (https://github.com/microsoft/monaco-editor/blob/main/LICENSE.md)
 * - shadcn/ui components: MIT License (https://github.com/shadcn/ui/blob/main/LICENSE.md)
 * - React Query: MIT License (https://github.com/TanStack/query/blob/main/LICENSE)
 * 
 * While these dependencies are open source, this file and its contents remain proprietary
 * and may not be copied, modified, or distributed without explicit permission.
 */

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { MonacoEditor } from "react-monaco-editor";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FileEditorProps {
  file: { id: string; content: string } | null;
  onSave: (id: string, content: string) => void;
  projectId: string | null;
}

export function FileEditor({ file, onSave, projectId }: FileEditorProps) {
  const editorRef = useRef<any>(null);
  const { toast } = useToast();

  const { data: fileContent, isLoading } = useQuery({
    queryKey: ["fileContent", file?.id],
    queryFn: async () => {
      if (!file) return "";
      const { data, error } = await supabase
        .from("files")
        .select("content")
        .eq("id", file.id)
        .single();

      if (error) throw error;
      return data.content;
    },
    enabled: !!file,
  });

  useEffect(() => {
    if (editorRef.current && fileContent) {
      editorRef.current.setValue(fileContent);
    }
  }, [fileContent]);

  const handleSave = () => {
    if (file) {
      const content = editorRef.current.getValue();
      onSave(file.id, content);
      toast({
        title: "File saved",
        description: "Your changes have been saved successfully.",
      });
    }
  };

  return (
    <div className="h-full">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <MonacoEditor
          ref={editorRef}
          language="javascript"
          theme="vs-dark"
          options={{
            selectOnLineNumbers: true,
            automaticLayout: true,
          }}
          onChange={handleSave}
        />
      )}
    </div>
  );
}
