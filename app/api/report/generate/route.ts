import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromToken, getTokenFromRequest } from "@/lib/auth";
import { generateWeeklyReport, generateMonthlyReport, saveReport } from "@/lib/report/generator";
import { ReportType } from "@prisma/client";

const generateSchema = z.object({
  reportType: z.enum(["WEEKLY", "MONTHLY"]),
});

export async function POST(request: Request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);
    if (!user || !user.studentId) {
      return NextResponse.json(
        { success: false, error: "Student account required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = generateSchema.parse(body);

    // Generate report based on type
    let reportContent;
    if (validated.reportType === "WEEKLY") {
      reportContent = await generateWeeklyReport(user.studentId);
    } else {
      reportContent = await generateMonthlyReport(user.studentId);
    }

    // Extract AI recommendations from content
    const aiRecommendations = reportContent.highlights.join("\n") + 
      (reportContent.concerns.length > 0 ? "\n\nAreas to focus on:\n" + reportContent.concerns.join("\n") : "");

    // Save report
    const reportId = await saveReport(
      user.studentId,
      validated.reportType as ReportType,
      reportContent,
      aiRecommendations
    );

    return NextResponse.json({
      success: true,
      data: {
        reportId,
        content: reportContent,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input" },
        { status: 400 }
      );
    }

    console.error("Generate report error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
