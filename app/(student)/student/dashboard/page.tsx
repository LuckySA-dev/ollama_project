"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatsCard from "@/components/dashboard/StatsCard";
import BehaviorChart from "@/components/dashboard/BehaviorChart";
import StudentNavbar from "@/components/layout/StudentNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, TrendingUp, Award, Flame, FileText, ArrowRight, Sparkles, Brain, Target, Calendar, User, Mail, GraduationCap, Clock } from "lucide-react";
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
        {/* User Profile Card */}
        {stats?.user && (
          <Card className="mb-8 border-2 bg-gradient-to-br from-primary/5 via-background to-background">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                    <User className="h-10 w-10 md:h-12 md:w-12 text-white" />
                  </div>
                </div>
                
                {/* User Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-1">{stats.user.name}</h3>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {stats.user.email}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                      <GraduationCap className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {stats.user.gradeLevel <= 9 
                          ? `มัธยมต้น ม.${stats.user.gradeLevel - 6}`
                          : `มัธยมปลาย ม.${stats.user.gradeLevel - 6}`
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        สมาชิกตั้งแต่ {new Date(stats.user.memberSince).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Summary */}
                <div className="flex md:flex-col gap-4 md:gap-2 md:items-end">
                  <div className="text-center md:text-right">
                    <div className="text-2xl font-bold text-primary">{stats.totalSessions}</div>
                    <div className="text-xs text-muted-foreground">เซสชันทั้งหมด</div>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="text-2xl font-bold text-orange-500">{stats.streakDays}</div>
                    <div className="text-xs text-muted-foreground">วันติดต่อกัน</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                ยินดีต้อนรับกลับมา{stats?.user ? `, ${stats.user.name.split(' ')[0]}` : ''}!
              </h2>
              <p className="text-muted-foreground">พร้อมเรียนรู้และพัฒนาตัวเองวันนี้หรือยัง?</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 hover:border-primary/50 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{stats?.totalSessions || 0}</div>
                  <div className="text-xs text-muted-foreground">+{stats?.weeklySessions || 0} สัปดาห์นี้</div>
                </div>
              </div>
              <div className="text-sm font-medium">การสนทนาทั้งหมด</div>
              <div className="text-xs text-muted-foreground">เซสชันที่คุณสร้าง</div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all cursor-pointer" onClick={() => router.push('/student/progress')}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-green-500" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    {stats?.weeklyScore?.focusScore ? Math.round(stats.weeklyScore.focusScore) : "--"}
                  </div>
                  <div className="text-xs text-muted-foreground">คะแนน</div>
                </div>
              </div>
              <div className="text-sm font-medium">สมาธิในการเรียน</div>
              <div className="text-xs text-muted-foreground">
                {stats?.weeklyScore?.focusScore 
                  ? `${Math.round(stats.weeklyScore.focusScore)}/100 สัปดาห์นี้`
                  : "ยังไม่มีข้อมูล"}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all cursor-pointer" onClick={() => router.push('/student/progress')}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-500" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    {stats?.weeklyScore?.motivationScore ? Math.round(stats.weeklyScore.motivationScore) : "--"}
                  </div>
                  <div className="text-xs text-muted-foreground">คะแนน</div>
                </div>
              </div>
              <div className="text-sm font-medium">แรงจูงใจ</div>
              <div className="text-xs text-muted-foreground">
                {stats?.weeklyScore?.motivationScore 
                  ? `${Math.round(stats.weeklyScore.motivationScore)}/100 ${stats.weeklyScore.motivationScore >= 70 ? 'ทำได้ดีมาก!' : 'ต้องพัฒนา'}`
                  : "ยังไม่มีข้อมูล"}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all bg-gradient-to-br from-orange-500/5 to-red-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-500">{stats?.streakDays || 0}</div>
                  <div className="text-xs text-muted-foreground">วัน</div>
                </div>
              </div>
              <div className="text-sm font-medium">ติดต่อกัน</div>
              <div className="text-xs text-muted-foreground">เรียนรู้ทุกวัน 🔥</div>
            </CardContent>
          </Card>
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

        {/* Recent Activity */}
        {stats?.recentBehaviors && stats.recentBehaviors.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                กิจกรรมล่าสุด
              </CardTitle>
              <CardDescription>พฤติกรรมการเรียนที่บันทึกไว้</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentBehaviors.slice(0, 3).map((behavior: any) => (
                  <div key={behavior.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{behavior.behaviorType}</span>
                        <span className="text-xs text-muted-foreground">
                          ความเข้มข้น: {behavior.intensity}/10
                        </span>
                      </div>
                      {behavior.context && (
                        <p className="text-sm text-muted-foreground">{behavior.context}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(behavior.loggedAt).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-primary" />
            เริ่มต้นใช้งาน
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
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
