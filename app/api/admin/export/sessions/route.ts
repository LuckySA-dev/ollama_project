import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get all sessions
    const sessions = await prisma.chatSession.findMany({
      include: {
        student: {
          include: {
            user: true,
          },
        },
        messages: true,
      },
      orderBy: {
        startedAt: "desc",
      },
    });

    // Generate CSV
    const headers = [
      "Session ID",
      "Student Name",
      "Student Email",
      "Started At",
      "Ended At",
      "Message Count",
      "Summary",
    ];
    const rows = sessions.map((session: any) => [
      session.id,
      session.student?.user?.name || "Unknown",
      session.student?.user?.email || "Unknown",
      new Date(session.startedAt).toLocaleString("th-TH"),
      session.endedAt ? new Date(session.endedAt).toLocaleString("th-TH") : "Ongoing",
      session.messages.length,
      session.sessionSummary || "N/A",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row: any[]) =>
        row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="sessions-export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting sessions:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
