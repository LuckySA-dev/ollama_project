import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromToken, getTokenFromRequest } from "@/lib/auth";
import { startOfWeek, subWeeks } from "date-fns";

/**
 * GET /api/student/progress
 * Fetch student's progress data over time
 */
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const weeks = parseInt(searchParams.get("weeks") || "8");

    // Calculate date range
    const now = new Date();
    const startDate = subWeeks(startOfWeek(now), weeks);

    // Fetch behavior scores
    const behaviorScores = await prisma.behaviorScore.findMany({
      where: {
        studentId: user.studentId,
        weekStartDate: {
          gte: startDate,
        },
      },
      orderBy: {
        weekStartDate: "asc",
      },
    });

    // Fetch behavior logs for trend analysis
    const behaviorLogs = await prisma.studyBehaviorLog.findMany({
      where: {
        studentId: user.studentId,
        loggedAt: {
          gte: startDate,
        },
      },
      orderBy: {
        loggedAt: "asc",
      },
    });

    // Fetch chat sessions for activity tracking
    const sessions = await prisma.chatSession.findMany({
      where: {
        studentId: user.studentId,
        startedAt: {
          gte: startDate,
        },
      },
      include: {
        messages: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        startedAt: "asc",
      },
    });

    // Calculate weekly activity
    const weeklyActivity = behaviorScores.map((score: any) => {
      const weekSessions = sessions.filter(
        (s: any) =>
          s.startedAt >= score.weekStartDate &&
          s.startedAt < new Date(score.weekStartDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      );

      const weekBehaviors = behaviorLogs.filter(
        (b: any) =>
          b.loggedAt >= score.weekStartDate &&
          b.loggedAt < new Date(score.weekStartDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      );

      return {
        week: score.weekStartDate,
        focusScore: score.focusScore,
        motivationScore: score.motivationScore,
        stressLevel: score.stressLevel,
        consistencyScore: score.consistencyScore,
        sessionCount: weekSessions.length,
        messageCount: weekSessions.reduce((sum: number, s: any) => sum + s.messages.length, 0),
        behaviorCount: weekBehaviors.length,
      };
    });

    // Calculate overall trends
    const latestScore = behaviorScores[behaviorScores.length - 1];
    const previousScore = behaviorScores[behaviorScores.length - 2];

    const trends = latestScore && previousScore ? {
      focus: latestScore.focusScore - previousScore.focusScore,
      motivation: latestScore.motivationScore - previousScore.motivationScore,
      stress: latestScore.stressLevel - previousScore.stressLevel,
      consistency: latestScore.consistencyScore - previousScore.consistencyScore,
    } : null;

    // Calculate behavior distribution
    const behaviorDistribution: Record<string, number> = {};
    behaviorLogs.forEach((log: any) => {
      behaviorDistribution[log.behaviorType] = (behaviorDistribution[log.behaviorType] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      data: {
        weeklyActivity,
        trends,
        behaviorDistribution,
        totalSessions: sessions.length,
        totalBehaviors: behaviorLogs.length,
        currentScores: latestScore ? {
          focus: latestScore.focusScore,
          motivation: latestScore.motivationScore,
          stress: latestScore.stressLevel,
          consistency: latestScore.consistencyScore,
        } : null,
      },
    });
  } catch (error) {
    console.error("Error fetching progress data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch progress data" },
      { status: 500 }
    );
  }
}
