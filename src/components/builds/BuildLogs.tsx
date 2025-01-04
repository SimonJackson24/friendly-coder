import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BuildLogsProps {
  buildId: string;
}

export function BuildLogs({ buildId }: BuildLogsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: logs } = useQuery({
    queryKey: ["buildLogs", buildId],
    queryFn: async () => {
      console.log("Fetching logs for build:", buildId);
      const { data, error } = await supabase
        .from("builds")
        .select("build_logs")
        .eq("id", buildId)
        .single();

      if (error) throw error;
      return data.build_logs || [];
    },
    refetchInterval: 5000, // Poll every 5 seconds for new logs
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <ScrollArea className="h-[200px] mt-4 border rounded-md bg-black/10" ref={scrollRef}>
      <div className="p-4 font-mono text-sm">
        {logs?.map((log: string, index: number) => (
          <div key={index} className="text-sm">
            {log}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}