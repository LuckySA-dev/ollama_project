import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean up existing demo data
  console.log("🧹 Cleaning up existing demo data...");
  await prisma.message.deleteMany({});
  await prisma.chatSession.deleteMany({});
  await prisma.studyBehaviorLog.deleteMany({});
  await prisma.behaviorScore.deleteMany({});
  await prisma.reportHistory.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ["admin@demo.com", "student@demo.com", "student2@demo.com", "student3@demo.com"]
      }
    }
  });
  console.log("✅ Cleanup completed");

  // Create ADMIN demo user
  const adminPassword = await bcrypt.hash("demo123", 10);
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@demo.com",
      password: adminPassword,
      name: "Admin Demo",
      role: Role.ADMIN,
    },
  });
  console.log("✅ Created admin:", adminUser.email, "(password: demo123)");

  // Create STUDENT demo users
  const students = [
    { name: "สมชาย ใจดี", email: "student@demo.com", grade: 9 },
    { name: "สมหญิง รักเรียน", email: "student2@demo.com", grade: 10 },
    { name: "ณัฐพล ขยัน", email: "student3@demo.com", grade: 11 },
  ];

  for (const studentData of students) {
    const studentPassword = await bcrypt.hash("demo123", 10);
    const user = await prisma.user.create({
      data: {
        email: studentData.email,
        password: studentPassword,
        name: studentData.name,
        role: Role.STUDENT,
        student: {
          create: {
            gradeLevel: studentData.grade,
          },
        },
      },
      include: {
        student: true,
      },
    });

    console.log(`✅ Created student: ${user.email} (Grade ${studentData.grade}, password: demo123)`);

    // Create sample chat session for first student
    if (studentData.email === "student@demo.com") {
      const session = await prisma.chatSession.create({
        data: {
          studentId: user.student!.id,
          sessionSummary: "พูดคุยเรื่องการจัดการเวลาและเทคนิคการเรียน",
          messages: {
            create: [
              {
                role: "user",
                content: "หนูมีปัญหาเรื่องสมาธิตอนทำการบ้านหลังเลิกเรียนค่ะ ไม่รู้ทำยังไงดี",
                behaviorTags: JSON.stringify(["focus", "procrastination"]),
              },
              {
                role: "assistant",
                content:
                  "เข้าใจเลยค่ะ หลายคนก็มีปัญหาแบบนี้เหมือนกัน มาลองแก้ไขด้วยกันนะคะ อยากรู้ว่าอะไรที่ทำให้เสียสมาธิบ้างคะ?",
              },
              {
                role: "user",
                content: "ส่วนใหญ่จะเล่นโทรศัพท์ หรือไม่ก็คิดถึงเกมที่อยากเล่นค่ะ",
              },
              {
                role: "assistant",
                content:
                  "เข้าใจค่ะ นี่เป็นเรื่องปกติมากเลย! ลองใช้เทคนิค Pomodoro ดูไหมคะ - ทำงาน 25 นาที พัก 5 นาที ระหว่างทำงานให้เอาโทรศัพท์ไปไว้ห้องอื่น ลองทำวันนี้ดูไหมคะ?",
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
            context: "มีปัญหาเรื่องสมาธิหลังเลิกเรียน",
          },
          {
            studentId: user.student!.id,
            behaviorType: "PROCRASTINATION",
            intensity: 6,
            context: "เสียสมาธิจากโทรศัพท์และเกม",
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

      console.log("✅ Created sample data for demo student");
    }
  }

  console.log("\n🎉 Database seed completed!");
  console.log("\n📝 Demo Accounts:");
  console.log("   Admin:   admin@demo.com    (password: demo123)");
  console.log("   Student: student@demo.com  (password: demo123)");
  console.log("\n💡 Use these accounts to test the system!\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
