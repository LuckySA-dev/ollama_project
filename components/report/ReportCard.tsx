import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { FileText } from "lucide-react";
import type { Report } from "@/types";

interface ReportCardProps {
  report: Report;
  onClick?: () => void;
}

export default function ReportCard({ report, onClick }: ReportCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">
              {report.reportType === "WEEKLY" ? "Weekly" : "Monthly"} Report
            </CardTitle>
          </div>
          <Badge variant="secondary">{formatDate(report.generatedAt)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {report.content.summary}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {report.content.metrics.totalChatSessions} sessions
          </div>
          <div className="text-xs font-medium text-primary">View Details →</div>
        </div>
      </CardContent>
    </Card>
  );
}
