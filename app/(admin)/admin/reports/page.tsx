"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/layout/AdminNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, TrendingUp, Calendar, Users, MessageSquare, BarChart3, RefreshCw } from "lucide-react";
import { downloadStatisticsReport } from "@/lib/pdf/reportGenerator";

interface SystemReport {
  totalUsers: number;
  totalStudents: number;
  totalSessions: number;
  totalMessages: number;
  totalReports: number;
  avgSessionsPerStudent: number;
  avgMessagesPerSession: number;
  weeklyGrowth: {
    users: number;
    sessions: number;
  };
  topStudents: Array<{
    name: string;
    email: string;
    sessionCount: number;
  }>;
}

export default function AdminReportsPage() {
  const router = useRouter();
  const [report, setReport] = useState<SystemReport | null>(null);
  const [loading, setLoading] = useState(true);

  const handleExport = async (type: "users" | "sessions") => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(`/api/admin/export/${type}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}-export-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("เกิดข้อผิดพลาดในการส่งออกข้อมูล");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("เกิดข้อผิดพลาดในการส่งออกข้อมูล");
    }
  };

  const handleExportPDF = () => {
    if (!report) {
      alert("ไม่มีข้อมูลสำหรับสร้างรายงาน");
      return;
    }
    
    try {
      downloadStatisticsReport(report);
    } catch (error) {
      console.error("PDF export error:", error);
      alert("เกิดข้อผิดพลาดในการสร้าง PDF");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchReport();
  }, [router]);

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/admin/reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setReport(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch report:", error);
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
            <p className="text-muted-foreground">กำลังโหลดรายงาน...</p>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  รายงานระบบ
                </h1>
                <p className="text-muted-foreground">สถิติและข้อมูลการใช้งานระบบ</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={fetchReport}>
                <RefreshCw className="h-4 w-4" />
                รีเฟรช
              </Button>
              <Button className="gap-2" onClick={() => handleExport("users")}>
                <Download className="h-4 w-4" />
                ดาวน์โหลด
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                ผู้ใช้ทั้งหมด
              </CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{report?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{report?.weeklyGrowth?.users || 0} สัปดาห์นี้
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                การสนทนา
              </CardTitle>
              <MessageSquare className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{report?.totalSessions || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{report?.weeklyGrowth?.sessions || 0} สัปดาห์นี้
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                ข้อความทั้งหมด
              </CardTitle>
              <FileText className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{report?.totalMessages || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                เฉลี่ย {report?.avgMessagesPerSession?.toFixed(1) || 0} ต่อเซสชัน
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                รายงานที่สร้าง
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{report?.totalReports || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                รายงานทั้งหมด
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>สถิติการใช้งาน</CardTitle>
              <CardDescription>ข้อมูลการใช้งานโดยรวม</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">นักเรียนทั้งหมด</span>
                <span className="font-semibold">{report?.totalStudents || 0} คน</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">เฉลี่ยเซสชันต่อนักเรียน</span>
                <span className="font-semibold">
                  {report?.avgSessionsPerStudent?.toFixed(1) || 0} เซสชัน
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">เฉลี่ยข้อความต่อเซสชัน</span>
                <span className="font-semibold">
                  {report?.avgMessagesPerSession?.toFixed(1) || 0} ข้อความ
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>นักเรียนที่ใช้งานมากที่สุด</CardTitle>
              <CardDescription>Top 5 นักเรียนที่มีการสนทนามากที่สุด</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report?.topStudents && report.topStudents.length > 0 ? (
                  report.topStudents.map((student, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                      <div className="text-sm font-semibold">
                        {student.sessionCount} เซสชัน
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    ยังไม่มีข้อมูล
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>ส่งออกรายงาน</CardTitle>
            <CardDescription>ดาวน์โหลดรายงานในรูปแบบต่างๆ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="gap-2" onClick={() => handleExport("users")}>
                <FileText className="h-4 w-4" />
                รายงานผู้ใช้ (CSV)
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => handleExport("sessions")}>
                <MessageSquare className="h-4 w-4" />
                รายงานการสนทนา (CSV)
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
                <TrendingUp className="h-4 w-4" />
                รายงานสถิติ (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
