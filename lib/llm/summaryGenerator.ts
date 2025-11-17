import { ollamaClient } from "./ollamaClient";
import { getThaiSessionSummaryPrompt } from "./thaiPrompts";

export interface SessionSummary {
  summary: string;
  topics: string[];
  behaviors: string[];
  mood: string;
  recommendations: string[];
}

/**
 * Generate AI summary for a chat session in Thai
 */
export async function generateSessionSummary(
  messages: Array<{ role: string; content: string }>,
  gradeLevel: number
): Promise<SessionSummary> {
  try {
    // Build Thai prompt for session summary
    const prompt = getThaiSessionSummaryPrompt(messages, gradeLevel);

    // Get AI response
    const response = await ollamaClient.generate(prompt);

    // Parse JSON response
    try {
      const parsed = JSON.parse(response) as SessionSummary;
      return parsed;
    } catch (parseError) {
      console.error("Failed to parse session summary JSON:", parseError);
      
      // Return fallback summary
      return {
        summary: "สรุปการสนทนา: พูดคุยเกี่ยวกับการเรียนและพฤติกรรมการเรียน",
        topics: ["การเรียน", "พฤติกรรม"],
        behaviors: [],
        mood: "ปกติ",
        recommendations: ["ทำการบ้านให้ตรงเวลา", "พักผ่อนให้เพียงพอ"],
      };
    }
  } catch (error) {
    console.error("Error generating session summary:", error);
    
    // Return fallback summary
    return {
      summary: "ไม่สามารถสร้างสรุปได้ในขณะนี้",
      topics: [],
      behaviors: [],
      mood: "ไม่ทราบ",
      recommendations: [],
    };
  }
}

/**
 * Generate summary for multiple sessions (weekly/monthly)
 */
export async function generateMultiSessionSummary(
  sessions: Array<{
    id: string;
    messages: Array<{ role: string; content: string }>;
    startedAt: Date;
  }>,
  gradeLevel: number,
  period: "weekly" | "monthly"
): Promise<{
  overallSummary: string;
  sessionCount: number;
  totalMessages: number;
  commonTopics: string[];
  behaviorTrends: string[];
  recommendations: string[];
}> {
  try {
    // Aggregate all messages
    const allMessages = sessions.flatMap((s) => s.messages);
    const totalMessages = allMessages.length;

    // Generate summaries for each session
    const sessionSummaries = await Promise.all(
      sessions.map((session) =>
        generateSessionSummary(session.messages, gradeLevel)
      )
    );

    // Aggregate topics and behaviors
    const allTopics = sessionSummaries.flatMap((s) => s.topics);
    const allBehaviors = sessionSummaries.flatMap((s) => s.behaviors);

    // Count occurrences
    const topicCounts: Record<string, number> = {};
    allTopics.forEach((topic) => {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });

    const behaviorCounts: Record<string, number> = {};
    allBehaviors.forEach((behavior) => {
      behaviorCounts[behavior] = (behaviorCounts[behavior] || 0) + 1;
    });

    // Get top topics and behaviors
    const commonTopics = Object.entries(topicCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([topic]) => topic);

    const behaviorTrends = Object.entries(behaviorCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([behavior]) => behavior);

    // Aggregate recommendations
    const allRecommendations = sessionSummaries.flatMap((s) => s.recommendations);
    const uniqueRecommendations = [...new Set(allRecommendations)].slice(0, 5);

    // Generate overall summary
    const periodText = period === "weekly" ? "สัปดาห์" : "เดือน";
    const overallSummary = `ในช่วง${periodText}นี้ มีการสนทนาทั้งหมด ${sessions.length} ครั้ง 
    หัวข้อที่พูดคุยบ่อย: ${commonTopics.join(", ")} 
    พฤติกรรมที่พบ: ${behaviorTrends.join(", ")}`;

    return {
      overallSummary,
      sessionCount: sessions.length,
      totalMessages,
      commonTopics,
      behaviorTrends,
      recommendations: uniqueRecommendations,
    };
  } catch (error) {
    console.error("Error generating multi-session summary:", error);
    
    return {
      overallSummary: "ไม่สามารถสร้างสรุปได้ในขณะนี้",
      sessionCount: sessions.length,
      totalMessages: 0,
      commonTopics: [],
      behaviorTrends: [],
      recommendations: [],
    };
  }
}
