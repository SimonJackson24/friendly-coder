import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { DateRange } from "react-day-picker";

interface CustomReportBuilderProps {
  data: any[];
  onGenerateReport: (config: ReportConfig) => void;
}

interface ReportConfig {
  metrics: string[];
  dateRange: DateRange | undefined;
  platforms: string[];
}

export function CustomReportBuilder({ data, onGenerateReport }: CustomReportBuilderProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const metrics = [
    { id: "impressions", label: "Impressions" },
    { id: "clicks", label: "Clicks" },
    { id: "conversions", label: "Conversions" },
    { id: "spend", label: "Spend" },
    { id: "revenue", label: "Revenue" },
    { id: "roas", label: "ROAS" },
  ];

  const platforms = ["facebook", "instagram", "twitter", "google"];

  const handleGenerateReport = () => {
    onGenerateReport({
      metrics: selectedMetrics,
      dateRange,
      platforms: selectedPlatforms,
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-lg font-medium">Custom Report Builder</h3>
      
      <div className="space-y-4">
        <div>
          <Label>Select Metrics</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {metrics.map((metric) => (
              <div key={metric.id} className="flex items-center space-x-2">
                <Checkbox
                  id={metric.id}
                  checked={selectedMetrics.includes(metric.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedMetrics([...selectedMetrics, metric.id]);
                    } else {
                      setSelectedMetrics(selectedMetrics.filter((m) => m !== metric.id));
                    }
                  }}
                />
                <Label htmlFor={metric.id}>{metric.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Date Range</Label>
          <div className="mt-2">
            <DatePickerWithRange
              date={dateRange}
              onDateChange={setDateRange}
            />
          </div>
        </div>

        <div>
          <Label>Platforms</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {platforms.map((platform) => (
              <div key={platform} className="flex items-center space-x-2">
                <Checkbox
                  id={platform}
                  checked={selectedPlatforms.includes(platform)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedPlatforms([...selectedPlatforms, platform]);
                    } else {
                      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
                    }
                  }}
                />
                <Label htmlFor={platform} className="capitalize">{platform}</Label>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleGenerateReport} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>
    </Card>
  );
}