import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromToken, getTokenFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
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

    const reports = await prisma.reportHistory.findMany({
      where: { studentId: user.studentId },
      orderBy: { generatedAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      data: reports.map((r: any) => ({
        id: r.id,
        reportType: r.reportType,
        generatedAt: r.generatedAt,
        content: r.content,
        aiRecommendations: r.aiRecommendations,
      })),
    });
  } catch (error) {
    console.error("Get report history error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get report history" },
      { status: 500 }
    );
  }
}
