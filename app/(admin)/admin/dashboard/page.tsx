"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/layout/AdminNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, MessageSquare, FileText, TrendingUp, Activity, ArrowRight, BarChart3 } from "lucide-react";
import Link from "next/link";

interface AdminStats {
  totalStudents: number;
  totalSessions: number;
  totalReports: number;
  activeToday: number;
  avgSessionsPerStudent: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/admin/stats", {
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
        <AdminNavbar />
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
      <AdminNavbar />
      <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              แดชบอร์ดผู้ดูแลระบบ
            </h1>
            <p className="text-muted-foreground">ภาพรวมของระบบ StudyBuddy</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              นักเรียนทั้งหมด
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ผู้ใช้งานในระบบ
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              การสนทนาทั้งหมด
            </CardTitle>
            <MessageSquare className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalSessions || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              เซสชันการสนทนา
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              รายงานที่สร้าง
            </CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalReports || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              รายงานทั้งหมด
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ผู้ใช้งานวันนี้
            </CardTitle>
            <Activity className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.activeToday || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ผู้ใช้งานที่ active
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              เฉลี่ยต่อนักเรียน
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.avgSessionsPerStudent?.toFixed(1) || "0.0"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              เซสชันต่อคน
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ArrowRight className="h-5 w-5 text-primary" />
          การจัดการระบบ
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/admin/users">
            <Card className="hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-lg">จัดการผู้ใช้</CardTitle>
                <CardDescription>
                  ดูและแก้ไขข้อมูลผู้ใช้ทั้งหมด
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/reports">
            <Card className="hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                    <FileText className="h-6 w-6 text-green-500" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-lg">รายงานระบบ</CardTitle>
                <CardDescription>
                  ดูสถิติและวิเคราะห์การใช้งาน
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/users">
            <Card className="hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <TrendingUp className="h-6 w-6 text-purple-500" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-lg">สร้างผู้ใช้ใหม่</CardTitle>
                <CardDescription>
                  เพิ่มนักเรียนหรือผู้ดูแลระบบ
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
