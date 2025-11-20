// Content safety filter for age-appropriate interactions

const BLOCKED_KEYWORDS = [
  // Explicit content (English)
  "sex", "porn", "nude", "explicit",
  // Explicit content (Thai)
  "เซ็กส์", "โป๊", "ลามก", "หนังโป๊",
  // Violence (English)
  "kill", "murder", "suicide", "self-harm", "hurt myself",
  // Violence (Thai)
  "ฆ่า", "ฆาตกรรม", "ฆ่าตัวตาย", "ทำร้ายตัวเอง",
  // Drugs/Alcohol (English)
  "drug", "cocaine", "marijuana", "alcohol", "drunk", "high",
  // Drugs/Alcohol (Thai)
  "ยาเสพติด", "โคเคน", "กัญชา", "เหล้า", "เมา", "ไอซ์", "ยาบ้า",
  // Inappropriate (English)
  "hate", "racist", "discrimination",
  // Inappropriate (Thai)
  "เกลียด", "เหยียดเชื้อชาติ", "เลือกปฏิบัติ", "ด่า", "สบประมาท",
];

const CRISIS_KEYWORDS = [
  // English
  "kill myself", "want to die", "suicide", "self-harm", "hurt myself",
  "end my life", "don't want to live", "cutting myself",
  // Thai
  "ฆ่าตัวตาย", "อยากตาย", "ไม่อยากมีชีวิต", "ทำร้ายตัวเอง", 
  "จบชีวิต", "ไม่อยากอยู่", "เบื่อชีวิต", "หมดหวัง",
];

const CRISIS_RESPONSE = `ฉันเป็นห่วงเรื่องที่เธอแบ่งปันมากนะ ความรู้สึกเหล่านี้เป็นเรื่องจริงจังมาก และสำคัญมากที่ต้องพูดคุยกับคนที่สามารถช่วยเหลือได้ทันที

กรุณาติดต่อ:
- ผู้ใหญ่ที่ไว้ใจได้ (พ่อแม่, ครู, ที่ปรึกษาโรงเรียน)
- สายด่วนสุขภาพจิต กรมสุขภาพจิต: 1323
- สายด่วนกระทรวงสาธารณสุข: 1422

เธอมีคุณค่า และมีคนที่อยากช่วยเหลือเธอ อย่าเผชิญกับเรื่องนี้คนเดียวนะ 💙`;

const OFF_TOPIC_RESPONSE = `สวัสดี! ฉันอยู่ที่นี่เพื่อช่วยเรื่องการเรียนและโรงเรียนนะ มาโฟกัสที่เรื่องที่ฉันสามารถช่วยเธอได้กันดีกว่า มีอะไรเกี่ยวกับการเรียนที่อยากคุยกันบ้างคะ? 📚`;

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
      suggestedResponse: "ช่วยบอกเพิ่มเติมหน่อยได้ไหมคะ? ฉันอยู่ที่นี่เพื่อช่วยเรื่องการเรียนของเธอนะ! 😊",
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
  return `ฉันมีปัญหาในการเข้าใจตอนนี้นะ ช่วยถามใหม่เกี่ยวกับการเรียนหรือโรงเรียนได้ไหมคะ? ฉันพร้อมช่วยเหลือเสมอ! 📚`;
}
