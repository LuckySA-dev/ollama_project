import type { OllamaMessage } from "./ollamaClient";

export const SYSTEM_PROMPT = `You are StudyBuddy, an AI mentor for junior high school students (ages 12-15).

PERSONALITY:
- Encouraging, patient, and supportive
- Use age-appropriate language (avoid complex jargon)
- Never judgmental or harsh
- Friendly and relatable, like a helpful older sibling

GOALS:
- Help students develop better study habits
- Identify stress or burnout early
- Provide actionable, specific advice
- Encourage healthy work-life balance
- Build confidence and motivation

SAFETY RULES (CRITICAL):
- Never discuss inappropriate topics (violence, drugs, explicit content)
- If student shows signs of serious distress (self-harm, abuse, severe depression), immediately recommend speaking to a trusted adult, counselor, or calling a helpline
- Focus only on academic and study-related topics
- Redirect off-topic conversations gently back to studying
- Never provide medical, legal, or financial advice

RESPONSE STYLE:
- Keep responses under 150 words
- Ask clarifying questions to understand the student's situation
- Use examples relevant to middle school life
- Break down advice into simple, actionable steps
- Use occasional emojis to be friendly (but not excessive)
- Validate feelings before giving advice

BEHAVIOR DETECTION:
When students mention study challenges, identify and tag behaviors:
- FOCUS: Difficulty concentrating, easily distracted
- PROCRASTINATION: Delaying tasks, avoiding work
- STRESS: Feeling overwhelmed, anxious about grades
- MOTIVATION: Lack of interest, feeling unmotivated
- STUDY_TIME: Issues with time management
- BURNOUT: Exhaustion, feeling drained

Remember: You're here to support, not to judge. Every student learns differently.`;

export function buildChatMessages(
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>,
  newUserMessage: string
): OllamaMessage[] {
  const messages: OllamaMessage[] = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
  ];

  // Include last 10 messages for context
  const recentHistory = conversationHistory.slice(-10);
  for (const msg of recentHistory) {
    messages.push({
      role: msg.role,
      content: msg.content,
    });
  }

  messages.push({
    role: "user",
    content: newUserMessage,
  });

  return messages;
}

export function extractBehaviorTags(userMessage: string, aiResponse: string): string[] {
  const tags: string[] = [];
  const combined = (userMessage + " " + aiResponse).toLowerCase();

  const behaviorKeywords = {
    focus: ["focus", "concentrate", "distract", "attention", "mind wander"],
    procrastination: ["procrastinat", "delay", "put off", "avoid", "later"],
    stress: ["stress", "anxious", "worry", "overwhelm", "pressure", "nervous"],
    motivation: ["motivat", "interest", "boring", "don't want", "why bother"],
    study_time: ["time", "schedule", "manage", "organize", "plan"],
    burnout: ["tired", "exhaust", "drain", "burn out", "too much"],
  };

  for (const [behavior, keywords] of Object.entries(behaviorKeywords)) {
    if (keywords.some((keyword) => combined.includes(keyword))) {
      tags.push(behavior);
    }
  }

  return [...new Set(tags)]; // Remove duplicates
}

export function generateReportPrompt(
  studentName: string,
  weekData: {
    totalSessions: number;
    behaviors: Array<{ type: string; intensity: number; context?: string }>;
    scores: {
      focus: number;
      motivation: number;
      stress: number;
      consistency: number;
    };
  }
): string {
  return `Generate a brief weekly study behavior report for ${studentName}, a junior high school student.

DATA:
- Chat sessions this week: ${weekData.totalSessions}
- Focus score: ${weekData.scores.focus}/100
- Motivation score: ${weekData.scores.motivation}/100
- Stress level: ${weekData.scores.stress}/100
- Consistency score: ${weekData.scores.consistency}/100

OBSERVED BEHAVIORS:
${weekData.behaviors.map((b) => `- ${b.type} (intensity: ${b.intensity}/10)${b.context ? `: ${b.context}` : ""}`).join("\n")}

Please provide:
1. A brief summary (2-3 sentences) of the student's week
2. 2-3 specific, actionable recommendations
3. One positive highlight to encourage the student
4. Any concerns that need attention (if applicable)

Keep the tone supportive and age-appropriate. Format as JSON with keys: summary, recommendations (array), highlight, concerns (array).`;
}
