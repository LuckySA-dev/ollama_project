// Content safety filter for age-appropriate interactions

const BLOCKED_KEYWORDS = [
  // Explicit content
  "sex", "porn", "nude", "explicit",
  // Violence
  "kill", "murder", "suicide", "self-harm", "hurt myself",
  // Drugs/Alcohol
  "drug", "cocaine", "marijuana", "alcohol", "drunk", "high",
  // Inappropriate
  "hate", "racist", "discrimination",
];

const CRISIS_KEYWORDS = [
  "kill myself", "want to die", "suicide", "self-harm", "hurt myself",
  "end my life", "don't want to live", "cutting myself",
];

const CRISIS_RESPONSE = `I'm really concerned about what you're sharing. These feelings are serious, and it's important to talk to someone who can help right away.

Please reach out to:
- A trusted adult (parent, teacher, school counselor)
- National Suicide Prevention Lifeline: 988 (US)
- Crisis Text Line: Text HOME to 741741

You matter, and there are people who want to help you. Please don't face this alone. 💙`;

const OFF_TOPIC_RESPONSE = `Hey! I'm here to help with studying and school-related topics. Let's focus on how I can support your learning. What's something about school or studying you'd like to talk about? 📚`;

export interface SafetyCheckResult {
  isSafe: boolean;
  reason?: "blocked_content" | "crisis" | "off_topic";
  suggestedResponse?: string;
}

export function checkInputSafety(input: string): SafetyCheckResult {
  const lowerInput = input.toLowerCase();

  // Check for crisis keywords first (highest priority)
  for (const keyword of CRISIS_KEYWORDS) {
    if (lowerInput.includes(keyword)) {
      return {
        isSafe: false,
        reason: "crisis",
        suggestedResponse: CRISIS_RESPONSE,
      };
    }
  }

  // Check for blocked content
  for (const keyword of BLOCKED_KEYWORDS) {
    if (lowerInput.includes(keyword)) {
      return {
        isSafe: false,
        reason: "blocked_content",
        suggestedResponse: OFF_TOPIC_RESPONSE,
      };
    }
  }

  // Check if message is too short or nonsensical
  if (input.trim().length < 3) {
    return {
      isSafe: false,
      reason: "off_topic",
      suggestedResponse: "Could you tell me a bit more? I'm here to help with your studying! 😊",
    };
  }

  return { isSafe: true };
}

export function sanitizeInput(input: string): string {
  // Remove excessive whitespace
  let sanitized = input.trim().replace(/\s+/g, " ");

  // Limit length to prevent abuse
  if (sanitized.length > 1000) {
    sanitized = sanitized.substring(0, 1000);
  }

  // Remove potential HTML/script tags
  sanitized = sanitized.replace(/<[^>]*>/g, "");

  return sanitized;
}

export function checkOutputSafety(output: string): boolean {
  const lowerOutput = output.toLowerCase();

  // Check if AI accidentally generated inappropriate content
  for (const keyword of BLOCKED_KEYWORDS) {
    if (lowerOutput.includes(keyword)) {
      return false;
    }
  }

  return true;
}

export function getFallbackResponse(): string {
  return `I'm having trouble understanding that right now. Could you rephrase your question about studying or school? I'm here to help! 📚`;
}
