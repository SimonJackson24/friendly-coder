import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format } from "date-fns";

interface ROIAnalysisProps {
  data: any[];
}

export function ROIAnalysis({ data }: ROIAnalysisProps) {
  const roiData = data.map(item => ({
    ...item,
    roi: ((item.revenue - item.spend) / item.spend) * 100,
    date: format(new Date(item.date), 'MMM dd'),
  }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-6">ROI Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold">
            ${data.reduce((acc, curr) => acc + curr.revenue, 0).toFixed(2)}
          </p>
        </Card>
        
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Cost</p>
          <p className="text-2xl font-bold">
            ${data.reduce((acc, curr) => acc + curr.spend, 0).toFixed(2)}
          </p>
        </Card>
        
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Average ROI</p>
          <p className="text-2xl font-bold">
            {(roiData.reduce((acc, curr) => acc + curr.roi, 0) / roiData.length).toFixed(2)}%
          </p>
        </Card>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={roiData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="roi" name="ROI %" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}