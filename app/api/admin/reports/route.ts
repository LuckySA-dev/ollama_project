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

    // Get behavior statistics grouped by type
    const behaviorStats = await prisma.studyBehaviorLog.groupBy({
      by: ["behaviorType"],
      _count: {
        id: true,
      },
      _avg: {
        intensity: true,
      },
    });

    const behaviorData = behaviorStats.map((stat: any) => ({
      type: stat.behaviorType,
      count: stat._count.id,
      avgIntensity: Math.round(stat._avg.intensity * 10) / 10,
    }));

    // Get daily session activity for the last 7 days
    const dailyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const sessionCount = await prisma.chatSession.count({
        where: {
          startedAt: {
            gte: day,
            lt: nextDay,
          },
        },
      });

      const messageCount = await prisma.message.count({
        where: {
          timestamp: {
            gte: day,
            lt: nextDay,
          },
        },
      });

      dailyActivity.push({
        date: day.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }),
        sessions: sessionCount,
        messages: messageCount,
      });
    }

    // Get grade level distribution
    const gradeLevelStats = await prisma.student.groupBy({
      by: ["gradeLevel"],
      _count: {
        id: true,
      },
      orderBy: {
        gradeLevel: "asc",
      },
    });

    const gradeDistribution = gradeLevelStats.map((stat: any) => ({
      grade: stat.gradeLevel <= 9 
        ? `ม.${stat.gradeLevel - 6} (มัธยมต้น)`
        : `ม.${stat.gradeLevel - 6} (มัธยมปลาย)`,
      count: stat._count.id,
    }));

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
        behaviorData,
        dailyActivity,
        gradeDistribution,
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
