import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromToken, getTokenFromRequest } from "@/lib/auth";

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

    const student = await prisma.student.findUnique({
      where: { id: user.studentId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        teacher: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: student.id,
        name: student.user.name,
        email: student.user.email,
        gradeLevel: student.gradeLevel,
        teacher: student.teacher
          ? {
              name: student.teacher.user.name,
              email: student.teacher.user.email,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get profile" },
      { status: 500 }
    );
  }
}
