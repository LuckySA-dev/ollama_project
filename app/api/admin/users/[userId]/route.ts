import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

// DELETE user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
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

    const { userId } = params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { student: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Prevent deleting yourself
    if (user.id === payload.userId) {
      return NextResponse.json(
        { success: false, error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Delete related data first
    if (user.student) {
      // Delete student's chat sessions and messages
      await prisma.message.deleteMany({
        where: {
          session: {
            studentId: user.student.id,
          },
        },
      });

      await prisma.chatSession.deleteMany({
        where: { studentId: user.student.id },
      });

      // Delete behavior logs and scores
      await prisma.studyBehaviorLog.deleteMany({
        where: { studentId: user.student.id },
      });

      await prisma.behaviorScore.deleteMany({
        where: { studentId: user.student.id },
      });

      // Delete report history
      await prisma.reportHistory.deleteMany({
        where: { studentId: user.student.id },
      });

      // Delete student record
      await prisma.student.delete({
        where: { id: user.student.id },
      });
    }

    // Finally delete the user
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH user (update)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
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

    const { userId } = params;
    const body = await request.json();
    const { name, email, role, gradeLevel } = body;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        role,
      },
      include: {
        student: true,
      },
    });

    // Update grade level if student
    if (updatedUser.student && gradeLevel) {
      await prisma.student.update({
        where: { id: updatedUser.student.id },
        data: { gradeLevel: parseInt(gradeLevel) },
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
