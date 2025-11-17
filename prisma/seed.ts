import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create teacher user
  const teacherPassword = await bcrypt.hash("teacher123", 10);
  const teacherUser = await prisma.user.create({
    data: {
      email: "teacher@school.com",
      password: teacherPassword,
      name: "Ms. Johnson",
      role: Role.TEACHER,
      teacher: {
        create: {},
      },
    },
    include: {
      teacher: true,
    },
  });

  console.log("✅ Created teacher:", teacherUser.email);

  // Create student users
  const students = [
    { name: "Alex Chen", email: "alex@student.com", grade: 7 },
    { name: "Maria Garcia", email: "maria@student.com", grade: 8 },
    { name: "Jordan Smith", email: "jordan@student.com", grade: 9 },
  ];

  for (const studentData of students) {
    const studentPassword = await bcrypt.hash("student123", 10);
    const user = await prisma.user.create({
      data: {
        email: studentData.email,
        password: studentPassword,
        name: studentData.name,
        role: Role.STUDENT,
        student: {
          create: {
            gradeLevel: studentData.grade,
            teacherId: teacherUser.teacher!.id,
          },
        },
      },
      include: {
        student: true,
      },
    });

    console.log(`✅ Created student: ${user.email} (Grade ${studentData.grade})`);

    // Create sample chat session for first student
    if (studentData.email === "alex@student.com") {
      const session = await prisma.chatSession.create({
        data: {
          studentId: user.student!.id,
          sessionSummary: "Discussed time management and study techniques",
          messages: {
            create: [
              {
                role: "user",
                content: "I'm having trouble focusing on my homework after school.",
                behaviorTags: JSON.stringify(["focus", "procrastination"]),
              },
              {
                role: "assistant",
                content:
                  "I understand that can be challenging! Let's work on this together. Can you tell me what usually distracts you when you try to do homework?",
              },
              {
                role: "user",
                content: "I usually check my phone or think about playing games.",
              },
              {
                role: "assistant",
                content:
                  "That's really common! Here's a strategy: Try the Pomodoro Technique - work for 25 minutes, then take a 5-minute break. During work time, put your phone in another room. Would you like to try this today?",
              },
            ],
          },
        },
      });

      // Create behavior logs
      await prisma.studyBehaviorLog.createMany({
        data: [
          {
            studentId: user.student!.id,
            behaviorType: "FOCUS",
            intensity: 4,
            context: "Difficulty focusing after school",
          },
          {
            studentId: user.student!.id,
            behaviorType: "PROCRASTINATION",
            intensity: 6,
            context: "Phone and game distractions",
          },
        ],
      });

      // Create behavior score
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week
      weekStart.setHours(0, 0, 0, 0);

      await prisma.behaviorScore.create({
        data: {
          studentId: user.student!.id,
          weekStartDate: weekStart,
          focusScore: 65,
          consistencyScore: 70,
          motivationScore: 75,
          stressLevel: 45,
        },
      });

      console.log("✅ Created sample data for Alex");
    }
  }

  console.log("🎉 Database seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
