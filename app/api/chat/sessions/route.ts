import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromToken, getTokenFromRequest } from "@/lib/auth";

/**
 * GET /api/chat/sessions
 * Fetch all chat sessions for the authenticated student
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

    // Fetch all sessions for this student
    const sessions = await prisma.chatSession.findMany({
      where: {
        studentId: user.studentId,
      },
      include: {
        messages: {
          select: {
            id: true,
            role: true,
            content: true,
            timestamp: true,
          },
          orderBy: {
            timestamp: "asc",
          },
        },
      },
      orderBy: {
        startedAt: "desc",
      },
    });

    // Format sessions with metadata
    const formattedSessions = sessions.map((session: any) => {
      const messageCount = session.messages.length;
      const lastMessage = session.messages[session.messages.length - 1];
      const firstUserMessage = session.messages.find((m: any) => m.role === "user");

      return {
        id: session.id,
        startedAt: session.startedAt,
        endedAt: session.endedAt,
        messageCount,
        lastMessageAt: lastMessage?.timestamp || session.startedAt,
        preview: firstUserMessage?.content.substring(0, 100) || "ไม่มีข้อความ",
        hasSummary: !!session.sessionSummary,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedSessions,
    });
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

/**
 * Helper function to fetch full details of a specific session
 * Used internally - not an API route
 */
async function GET_SESSION(sessionId: string, studentId: string) {
  try {
    const session = await prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        studentId: studentId,
      },
      include: {
        messages: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });

    if (!session) {
      return null;
    }

    return {
      id: session.id,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      sessionSummary: session.sessionSummary,
      messages: session.messages.map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
        behaviorTags: m.behaviorTags,
      })),
    };
  } catch (error) {
    console.error("Error fetching session details:", error);
    return null;
  }
}
