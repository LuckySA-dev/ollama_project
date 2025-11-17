"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatsCard from "@/components/dashboard/StatsCard";
import BehaviorChart from "@/components/dashboard/BehaviorChart";
import StudentNavbar from "@/components/layout/StudentNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, TrendingUp, Award, Flame, FileText, ArrowRight, Sparkles } from "lucide-react";
import type { DashboardStats } from "@/types";

export default function StudentDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/student/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <StudentNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <StudentNavbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">ยินดีต้อนรับกลับมา!</h2>
          </div>
          <p className="text-muted-foreground text-lg">นี่คือสรุปพฤติกรรมการเรียนของคุณในสัปดาห์นี้</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Sessions"
            value={stats?.totalSessions || 0}
            description="All-time chat sessions"
            icon={MessageSquare}
          />
          <StatsCard
            title="Focus Score"
            value={stats?.weeklyScore?.focusScore || "N/A"}
            description="This week's average"
            icon={TrendingUp}
          />
          <StatsCard
            title="Motivation"
            value={stats?.weeklyScore?.motivationScore || "N/A"}
            description="Keep it up!"
            icon={Award}
          />
          <StatsCard
            title="Study Streak"
            value={`${stats?.streakDays || 0} days`}
            description="Consecutive days"
            icon={Flame}
          />
        </div>

        {/* Chart */}
        {stats?.weeklyScore && (
          <div className="mb-8">
            <BehaviorChart
              data={[
                {
                  date: "This Week",
                  focus: stats.weeklyScore.focusScore,
                  motivation: stats.weeklyScore.motivationScore,
                  stress: stats.weeklyScore.stressLevel,
                },
              ]}
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">การดำเนินการด่วน</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/student/chat">
              <Card className="hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-lg">เริ่มการสนทนา</CardTitle>
                  <CardDescription>
                    พูดคุยกับ AI Mentor เกี่ยวกับปัญหาการเรียนของคุณ
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/student/reports">
              <Card className="hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-lg">ดูรายงาน</CardTitle>
                  <CardDescription>
                    ตรวจสอบรายงานความก้าวหน้าและคำแนะนำ
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/student/progress">
              <Card className="hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-lg">ความก้าวหน้า</CardTitle>
                  <CardDescription>
                    ติดตามพฤติกรรมและแนวโน้มการเรียนของคุณ
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
