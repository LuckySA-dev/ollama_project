import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromToken, getTokenFromRequest } from "@/lib/auth";
import { generateSessionSummary } from "@/lib/llm/summaryGenerator";

/**
 * GET /api/report/session/[sessionId]
 * Fetch or generate summary for a specific session
 */
export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
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

    const { sessionId } = params;

    // Fetch session with messages
    const session = await prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        studentId: user.studentId,
      },
      include: {
        messages: {
          orderBy: {
            timestamp: "asc",
          },
        },
        student: {
          select: {
            gradeLevel: true,
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    // Check if summary already exists
    if (session.sessionSummary) {
      try {
        const existingSummary = JSON.parse(session.sessionSummary);
        return NextResponse.json({
          success: true,
          data: {
            sessionId: session.id,
            summary: existingSummary,
            cached: true,
          },
        });
      } catch (e) {
        // If parsing fails, regenerate
        console.warn("Failed to parse existing summary, regenerating...");
      }
    }

    // Generate new summary
    const messages = session.messages.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    const summary = await generateSessionSummary(messages, session.student.gradeLevel);

    // Save summary to database
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        sessionSummary: JSON.stringify(summary),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        summary,
        cached: false,
      },
    });
  } catch (error) {
    console.error("Error fetching session summary:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/report/session/[sessionId]
 * Force regenerate summary for a session
 */
export async function POST(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
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

    const { sessionId } = params;

    // Fetch session with messages
    const session = await prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        studentId: user.studentId,
      },
      include: {
        messages: {
          orderBy: {
            timestamp: "asc",
          },
        },
        student: {
          select: {
            gradeLevel: true,
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    // Generate new summary
    const messages = session.messages.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    const summary = await generateSessionSummary(messages, session.student.gradeLevel);

    // Save summary to database
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        sessionSummary: JSON.stringify(summary),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        summary,
        regenerated: true,
      },
    });
  } catch (error) {
    console.error("Error regenerating session summary:", error);
    return NextResponse.json(
      { success: false, error: "Failed to regenerate summary" },
      { status: 500 }
    );
  }
}
