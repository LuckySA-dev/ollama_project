import { prisma } from "@/lib/db";
import { ollamaClient } from "@/lib/llm/ollamaClient";
import { generateReportPrompt } from "@/lib/llm/promptTemplate";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks } from "date-fns";
import type { ReportContent, BehaviorTrend } from "@/types";
import { BehaviorType, ReportType } from "@prisma/client";

export async function generateWeeklyReport(studentId: string): Promise<ReportContent> {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);

  // Get data for this week
  const sessions = await prisma.chatSession.findMany({
    where: {
      studentId,
      startedAt: { gte: weekStart, lte: weekEnd },
    },
    include: {
      messages: true,
    },
  });

  const behaviors = await prisma.studyBehaviorLog.findMany({
    where: {
      studentId,
      loggedAt: { gte: weekStart, lte: weekEnd },
    },
  });

  const currentScore = await prisma.behaviorScore.findFirst({
    where: {
      studentId,
      weekStartDate: weekStart,
    },
  });

  // Get previous week for comparison
  const prevWeekStart = subWeeks(weekStart, 1);
  const prevScore = await prisma.behaviorScore.findFirst({
    where: {
      studentId,
      weekStartDate: prevWeekStart,
    },
  });

  // Calculate behavior trends
  const behaviorTrends = calculateBehaviorTrends(behaviors, prevScore, currentScore);

  // Calculate metrics
  const totalMessages = sessions.reduce((sum: number, s) => sum + s.messages.length, 0);
  const avgSessionDuration = sessions.length > 0
    ? sessions.reduce((sum: number, s) => {
        if (s.endedAt) {
          return sum + (s.endedAt.getTime() - s.startedAt.getTime());
        }
        return sum;
      }, 0) / sessions.length / 60000 // Convert to minutes
    : 0;

  // Get student info
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { user: true },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  // Generate AI insights with Thai language support
  const aiPrompt = generateReportPrompt(student.user.name, {
    totalSessions: sessions.length,
    behaviors: behaviors.map((b: any) => ({
      type: b.behaviorType,
      intensity: b.intensity,
      context: b.context || undefined,
    })),
    scores: {
      focus: currentScore?.focusScore || 50,
      motivation: currentScore?.motivationScore || 50,
      stress: currentScore?.stressLevel || 50,
      consistency: currentScore?.consistencyScore || 50,
    },
  }, {
    language: "en", // Use English language
    gradeLevel: student.gradeLevel,
  });

  interface AIInsights {
    summary: string;
    recommendations: string[];
    highlight: string;
    concerns: string[];
  }

  let aiInsights: AIInsights;
  try {
    const response = await ollamaClient.generate(aiPrompt, { format: "json" });
    
    // Try to extract JSON from markdown code blocks if present
    let jsonString = response.trim();
    const jsonMatch = jsonString.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      jsonString = jsonMatch[1];
    } else if (jsonString.startsWith('```')) {
      // Remove markdown code blocks
      jsonString = jsonString.replace(/```(?:json)?\s*/g, '').replace(/```\s*$/g, '');
    }
    
    // Try to find JSON object in the response
    const jsonObjectMatch = jsonString.match(/\{[\s\S]*\}/);
    if (jsonObjectMatch) {
      jsonString = jsonObjectMatch[0];
    }
    
    aiInsights = JSON.parse(jsonString) as AIInsights;
  } catch (error) {
    console.error("Failed to generate AI insights:", error);
    console.error("Response was:", await ollamaClient.generate(aiPrompt).catch(() => "N/A"));
    
    // English fallback messages
    aiInsights = {
      summary: "Unable to generate automated report at this time, but you're doing great! Try chatting with AI Mentor regularly to track your progress.",
      recommendations: [
        "Chat with AI Mentor regularly",
        "Set clear learning goals",
        "Manage your time effectively"
      ],
      highlight: "You're using the system to improve yourself, which is excellent!",
      concerns: [],
    };
  }

  return {
    summary: aiInsights.summary,
    metrics: {
      totalChatSessions: sessions.length,
      averageSessionDuration: Math.round(avgSessionDuration),
      behaviorTrends,
    },
    highlights: [aiInsights.highlight],
    concerns: aiInsights.concerns || [],
  };
}

export async function generateMonthlyReport(studentId: string): Promise<ReportContent> {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const sessions = await prisma.chatSession.findMany({
    where: {
      studentId,
      startedAt: { gte: monthStart, lte: monthEnd },
    },
    include: {
      messages: true,
    },
  });

  const behaviors = await prisma.studyBehaviorLog.findMany({
    where: {
      studentId,
      loggedAt: { gte: monthStart, lte: monthEnd },
    },
  });

  // Get all weekly scores for the month
  const weeklyScores = await prisma.behaviorScore.findMany({
    where: {
      studentId,
      weekStartDate: { gte: monthStart, lte: monthEnd },
    },
    orderBy: { weekStartDate: "asc" },
  });

  // Calculate average scores
  const avgScores = weeklyScores.reduce(
    (acc: { focus: number; motivation: number; stress: number; consistency: number; count: number }, score: any) => ({
      focus: acc.focus + score.focusScore,
      motivation: acc.motivation + score.motivationScore,
      stress: acc.stress + score.stressLevel,
      consistency: acc.consistency + score.consistencyScore,
      count: acc.count + 1,
    }),
    { focus: 0, motivation: 0, stress: 0, consistency: 0, count: 0 }
  );

  const avgFocus = avgScores.count > 0 ? avgScores.focus / avgScores.count : 50;
  const avgMotivation = avgScores.count > 0 ? avgScores.motivation / avgScores.count : 50;
  const avgStress = avgScores.count > 0 ? avgScores.stress / avgScores.count : 50;

  // Identify patterns
  const behaviorCounts = behaviors.reduce((acc: Record<string, number>, b: any) => {
    acc[b.behaviorType] = (acc[b.behaviorType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topBehaviors = Object.entries(behaviorCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([type]) => type);

  const highlights: string[] = [];
  const concerns: string[] = [];

  if (avgFocus >= 70) highlights.push("Strong focus and concentration this month");
  if (avgMotivation >= 70) highlights.push("High motivation levels maintained");
  if (sessions.length >= 12) highlights.push(`Consistent engagement with ${sessions.length} sessions`);

  if (avgStress >= 70) concerns.push("Elevated stress levels detected");
  if (avgFocus < 50) concerns.push("Focus challenges need attention");
  if (sessions.length < 4) concerns.push("Low engagement - consider more regular check-ins");

  const behaviorTrends: BehaviorTrend[] = Object.values(BehaviorType).map((type) => {
    const typeBehaviors = behaviors.filter((b: any) => b.behaviorType === type);
    const avgIntensity = typeBehaviors.length > 0
      ? typeBehaviors.reduce((sum: number, b: any) => sum + b.intensity, 0) / typeBehaviors.length
      : 0;

    return {
      behaviorType: type,
      averageIntensity: Math.round(avgIntensity * 10),
      change: 0, // Would need previous month data
    };
  });

  return {
    summary: `This month, you had ${sessions.length} study sessions. Your average focus score was ${Math.round(avgFocus)}/100, and motivation was ${Math.round(avgMotivation)}/100.`,
    metrics: {
      totalChatSessions: sessions.length,
      averageSessionDuration: 0,
      behaviorTrends,
    },
    highlights,
    concerns,
  };
}

function calculateBehaviorTrends(
  behaviors: any[],
  prevScore: any,
  currentScore: any
): BehaviorTrend[] {
  const trends: BehaviorTrend[] = [];

  if (currentScore) {
    trends.push({
      behaviorType: BehaviorType.FOCUS,
      averageIntensity: currentScore.focusScore,
      change: prevScore ? currentScore.focusScore - prevScore.focusScore : 0,
    });

    trends.push({
      behaviorType: BehaviorType.MOTIVATION,
      averageIntensity: currentScore.motivationScore,
      change: prevScore ? currentScore.motivationScore - prevScore.motivationScore : 0,
    });

    trends.push({
      behaviorType: BehaviorType.STRESS,
      averageIntensity: currentScore.stressLevel,
      change: prevScore ? currentScore.stressLevel - prevScore.stressLevel : 0,
    });
  }

  return trends;
}

export async function saveReport(
  studentId: string,
  reportType: ReportType,
  content: ReportContent,
  aiRecommendations: string
): Promise<string> {
  const now = new Date();
  const report = await prisma.reportHistory.create({
    data: {
      studentId,
      reportType,
      content: content as any,
      aiRecommendations,
      weekStartDate: reportType === ReportType.WEEKLY ? startOfWeek(now) : null,
      monthStartDate: reportType === ReportType.MONTHLY ? startOfMonth(now) : null,
    },
  });

  return report.id;
}
