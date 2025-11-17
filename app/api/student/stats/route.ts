import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromToken, getTokenFromRequest } from "@/lib/auth";
import { startOfWeek, endOfWeek } from "date-fns";

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

    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);

    // Get total sessions
    const totalSessions = await prisma.chatSession.count({
      where: { studentId: user.studentId },
    });

    // Get this week's sessions
    const weeklySessions = await prisma.chatSession.count({
      where: {
        studentId: user.studentId,
        startedAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });

    // Get current week's behavior score
    const weeklyScore = await prisma.behaviorScore.findFirst({
      where: {
        studentId: user.studentId,
        weekStartDate: weekStart,
      },
    });

    // Get recent behaviors
    const recentBehaviors = await prisma.studyBehaviorLog.findMany({
      where: { studentId: user.studentId },
      orderBy: { loggedAt: "desc" },
      take: 5,
    });

    // Calculate streak (consecutive days with sessions)
    const recentSessions = await prisma.chatSession.findMany({
      where: { studentId: user.studentId },
      orderBy: { startedAt: "desc" },
      take: 30,
      select: { startedAt: true },
    });

    let streakDays = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessionDates = new Set(
      recentSessions.map((s: any) => {
        const d = new Date(s.startedAt);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    );

    let currentDate = today.getTime();
    while (sessionDates.has(currentDate)) {
      streakDays++;
      currentDate -= 24 * 60 * 60 * 1000; // Go back one day
    }

    return NextResponse.json({
      success: true,
      data: {
        totalSessions,
        weeklySessions,
        weeklyScore: weeklyScore
          ? {
              focusScore: weeklyScore.focusScore,
              consistencyScore: weeklyScore.consistencyScore,
              motivationScore: weeklyScore.motivationScore,
              stressLevel: weeklyScore.stressLevel,
            }
          : null,
        recentBehaviors: recentBehaviors.map((b: any) => ({
          id: b.id,
          behaviorType: b.behaviorType,
          intensity: b.intensity,
          context: b.context,
          loggedAt: b.loggedAt,
        })),
        streakDays,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get statistics" },
      { status: 500 }
    );
  }
}
