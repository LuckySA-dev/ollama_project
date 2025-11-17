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

    // Fetch all chat sessions with full details
    const sessions = await prisma.chatSession.findMany({
      where: {
        studentId: user.studentId,
      },
      include: {
        messages: {
          select: {
            id: true,
            behaviorTags: true,
          },
        },
      },
      orderBy: {
        startedAt: "desc",
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

    // Calculate behavior statistics
    const behaviorStats: Record<string, { count: number; totalIntensity: number }> = {};
    behaviorLogs.forEach((log: any) => {
      if (!behaviorStats[log.behaviorType]) {
        behaviorStats[log.behaviorType] = { count: 0, totalIntensity: 0 };
      }
      behaviorStats[log.behaviorType].count++;
      behaviorStats[log.behaviorType].totalIntensity += log.intensity;
    });

    const behaviorStatsArray = Object.entries(behaviorStats).map(([behaviorType, stats]) => ({
      behaviorType,
      count: stats.count,
      averageIntensity: stats.totalIntensity / stats.count,
    }));

    // Extract all behavior tags from messages
    const allBehaviorTags = new Set<string>();
    sessions.forEach((session: any) => {
      session.messages.forEach((msg: any) => {
        if (msg.behaviorTags) {
          try {
            const tags = typeof msg.behaviorTags === 'string' 
              ? JSON.parse(msg.behaviorTags) 
              : msg.behaviorTags;
            if (Array.isArray(tags)) {
              tags.forEach((tag: string) => allBehaviorTags.add(tag));
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      });
    });

    // Format chat sessions for display
    const chatSessions = sessions.map((session: any) => {
      const sessionTags = new Set<string>();
      session.messages.forEach((msg: any) => {
        if (msg.behaviorTags) {
          try {
            const tags = typeof msg.behaviorTags === 'string' 
              ? JSON.parse(msg.behaviorTags) 
              : msg.behaviorTags;
            if (Array.isArray(tags)) {
              tags.forEach((tag: string) => sessionTags.add(tag));
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      });

      return {
        id: session.id,
        startedAt: session.startedAt,
        sessionSummary: session.sessionSummary,
        messageCount: session.messages.length,
        behaviorTags: Array.from(sessionTags),
      };
    });

    // Format weekly scores
    const weeklyScores = behaviorScores.map((score: any) => ({
      weekStartDate: score.weekStartDate,
      focusScore: score.focusScore,
      motivationScore: score.motivationScore,
      stressLevel: score.stressLevel,
    }));

    // Calculate total messages
    const totalMessages = sessions.reduce((sum: number, s: any) => sum + s.messages.length, 0);

    return NextResponse.json({
      success: true,
      data: {
        chatSessions,
        behaviorStats: behaviorStatsArray,
        weeklyScores,
        totalMessages,
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
