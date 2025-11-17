import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get total students
    const totalStudents = await prisma.student.count();

    // Get total chat sessions
    const totalSessions = await prisma.chatSession.count();

    // Get total reports
    const totalReports = await prisma.reportHistory.count();

    // Get active users today (sessions started today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeTodayData = await prisma.chatSession.groupBy({
      by: ["studentId"],
      where: {
        startedAt: {
          gte: today,
        },
      },
    });
    const activeToday = activeTodayData.length;

    // Calculate average sessions per student
    const avgSessionsPerStudent = totalStudents > 0 
      ? totalSessions / totalStudents 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        totalSessions,
        totalReports,
        activeToday,
        avgSessionsPerStudent,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
