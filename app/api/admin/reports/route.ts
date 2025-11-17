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

    // Get total counts
    const totalUsers = await prisma.user.count();
    const totalStudents = await prisma.student.count();
    const totalSessions = await prisma.chatSession.count();
    const totalMessages = await prisma.message.count();
    const totalReports = await prisma.reportHistory.count();

    // Calculate averages
    const avgSessionsPerStudent = totalStudents > 0 ? totalSessions / totalStudents : 0;
    const avgMessagesPerSession = totalSessions > 0 ? totalMessages / totalSessions : 0;

    // Get weekly growth
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const newUsersThisWeek = await prisma.user.count({
      where: {
        createdAt: {
          gte: weekAgo,
        },
      },
    });

    const newSessionsThisWeek = await prisma.chatSession.count({
      where: {
        startedAt: {
          gte: weekAgo,
        },
      },
    });

    // Get top students by session count
    const topStudentsData = await prisma.chatSession.groupBy({
      by: ["studentId"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 5,
    });

    // Get student details for top students
    const topStudents = await Promise.all(
      topStudentsData.map(async (item: any) => {
        const student = await prisma.student.findUnique({
          where: { id: item.studentId },
          include: { user: true },
        });
        return {
          name: student?.user.name || "Unknown",
          email: student?.user.email || "",
          sessionCount: item._count.id,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalSessions,
        totalMessages,
        totalReports,
        avgSessionsPerStudent,
        avgMessagesPerSession,
        weeklyGrowth: {
          users: newUsersThisWeek,
          sessions: newSessionsThisWeek,
        },
        topStudents,
      },
    });
  } catch (error) {
    console.error("Error fetching admin reports:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
