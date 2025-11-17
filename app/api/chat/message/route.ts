import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserFromToken, getTokenFromRequest } from "@/lib/auth";
import { ollamaClient } from "@/lib/llm/ollamaClient";
import { buildChatMessages, extractBehaviorTags } from "@/lib/llm/promptTemplate";
import { checkInputSafety, sanitizeInput, checkOutputSafety, getFallbackResponse } from "@/lib/llm/safetyFilter";

const messageSchema = z.object({
  message: z.string().min(1).max(1000),
  sessionId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // Authenticate user
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

    // Fetch student's grade level for language support
    const student = await prisma.student.findUnique({
      where: { id: user.studentId },
      select: { gradeLevel: true },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validated = messageSchema.parse(body);

    // Sanitize and check input safety
    const sanitizedMessage = sanitizeInput(validated.message);
    const safetyCheck = checkInputSafety(sanitizedMessage);

    if (!safetyCheck.isSafe) {
      // Log the unsafe attempt
      console.warn(`Unsafe input from student ${user.studentId}: ${safetyCheck.reason}`);

      return NextResponse.json({
        success: true,
        data: {
          response: safetyCheck.suggestedResponse || getFallbackResponse(),
          messageId: "safety-response",
        },
      });
    }

    // Get or create chat session
    let sessionId = validated.sessionId;
    if (!sessionId) {
      const session = await prisma.chatSession.create({
        data: {
          studentId: user.studentId,
        },
      });
      sessionId = session.id;
    }

    // Get conversation history
    const history = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { timestamp: "asc" },
      take: 10,
      select: {
        role: true,
        content: true,
      },
    });

    // Build messages for LLM with Thai language support
    const messages = buildChatMessages(
      history.map((h: any) => ({
        role: h.role as "user" | "assistant",
        content: h.content,
      })),
      sanitizedMessage,
      {
        language: "th", // Use Thai language
        gradeLevel: student.gradeLevel,
      }
    );

    // Get AI response
    let aiResponse: string;
    try {
      aiResponse = await ollamaClient.chat(messages);

      // Check output safety
      if (!checkOutputSafety(aiResponse)) {
        aiResponse = getFallbackResponse();
      }
    } catch (error) {
      console.error("LLM error:", error);
      aiResponse = "I'm having trouble right now. Could you try asking that again? 😊";
    }

    // Extract behavior tags with Thai language support
    const behaviorTags = extractBehaviorTags(sanitizedMessage, aiResponse, "th");

    // Save messages
    const userMessage = await prisma.message.create({
      data: {
        sessionId,
        role: "user",
        content: sanitizedMessage,
        behaviorTags: behaviorTags.length > 0 ? behaviorTags : [],
      },
    });

    const assistantMessage = await prisma.message.create({
      data: {
        sessionId,
        role: "assistant",
        content: aiResponse,
      },
    });

    // Log behaviors if detected
    if (behaviorTags.length > 0) {
      const behaviorLogs = behaviorTags.map((tag) => ({
        studentId: user.studentId!,
        behaviorType: tag.toUpperCase(),
        intensity: 5, // Default intensity, can be improved with sentiment analysis
        context: sanitizedMessage.substring(0, 200),
      }));

      await prisma.studyBehaviorLog.createMany({
        data: behaviorLogs as any,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        response: aiResponse,
        messageId: assistantMessage.id,
        sessionId,
        behaviorTags,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input" },
        { status: 400 }
      );
    }

    console.error("Chat message error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process message" },
      { status: 500 }
    );
  }
}
