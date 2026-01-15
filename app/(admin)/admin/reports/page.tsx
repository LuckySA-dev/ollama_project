"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/layout/AdminNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, TrendingUp, Calendar, Users, MessageSquare, BarChart3, RefreshCw, Activity, Brain } from "lucide-react";
import { downloadStatisticsReport } from "@/lib/pdf/reportGenerator";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
  behaviorData?: Array<{
    type: string;
    count: number;
    avgIntensity: number;
  }>;
  dailyActivity?: Array<{
    date: string;
    sessions: number;
    messages: number;
  }>;
  gradeDistribution?: Array<{
    grade: string;
    count: number;
  }>;
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

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
          <Card className="border-2 hover:border-primary/50 transition-all bg-gradient-to-br from-blue-500/5 to-background">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                ผู้ใช้ทั้งหมด
              </CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{report?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +{report?.weeklyGrowth?.users || 0} สัปดาห์นี้
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all bg-gradient-to-br from-purple-500/5 to-background">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                การสนทนา
              </CardTitle>
              <MessageSquare className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-500">{report?.totalSessions || 0}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +{report?.weeklyGrowth?.sessions || 0} สัปดาห์นี้
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all bg-gradient-to-br from-green-500/5 to-background">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                ข้อความทั้งหมด
              </CardTitle>
              <FileText className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{report?.totalMessages || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                เฉลี่ย {report?.avgMessagesPerSession?.toFixed(1) || 0} ต่อเซสชัน
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all bg-gradient-to-br from-orange-500/5 to-background">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                รายงานที่สร้าง
              </CardTitle>
              <Activity className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{report?.totalReports || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                รายงานทั้งหมด
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Activity Chart */}
          {report?.dailyActivity && report.dailyActivity.length > 0 && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  กิจกรรมรายวัน (7 วันที่ผ่านมา)
                </CardTitle>
                <CardDescription>จำนวนเซสชันและข้อความต่อวัน</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={report.dailyActivity}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))',
                        padding: '12px'
                      }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: '600' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sessions" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      name="เซสชัน"
                      dot={{ fill: '#8b5cf6' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="messages" 
                      stroke="#06b6d4" 
                      strokeWidth={2}
                      name="ข้อความ"
                      dot={{ fill: '#06b6d4' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Grade Distribution Chart */}
          {report?.gradeDistribution && report.gradeDistribution.length > 0 && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  การกระจายตามระดับชั้น
                </CardTitle>
                <CardDescription>จำนวนนักเรียนในแต่ละระดับชั้น</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={report.gradeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="grade" className="text-xs" angle={-45} textAnchor="end" height={80} />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))',
                        padding: '12px'
                      }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: '600' }}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" name="จำนวนนักเรียน" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Behavior Analysis Chart */}
        {report?.behaviorData && report.behaviorData.length > 0 && (
          <Card className="border-2 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                การวิเคราะห์พฤติกรรมการเรียน
              </CardTitle>
              <CardDescription>สถิติพฤติกรรมและความเข้มข้นเฉลี่ย</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={report.behaviorData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="type" className="text-xs" angle={-45} textAnchor="end" height={100} />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))',
                        padding: '12px'
                      }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: '600' }}
                    />
                    <Legend />
                    <Bar dataKey="count" fill="#10b981" name="จำนวนบันทึก" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={report.behaviorData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {report.behaviorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))',
                        padding: '12px'
                      }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: '600' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Behavior Details Table */}
              <div className="mt-6 space-y-2">
                <h4 className="font-semibold text-sm mb-3">รายละเอียดพฤติกรรม</h4>
                {report.behaviorData.map((behavior, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium">{behavior.type}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {behavior.count} บันทึก
                      </span>
                      <span className="font-semibold">
                        ความเข้มข้น: {behavior.avgIntensity}/10
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                สถิติการใช้งาน
              </CardTitle>
              <CardDescription>ข้อมูลการใช้งานโดยรวม</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                <span className="text-sm text-muted-foreground">นักเรียนทั้งหมด</span>
                <span className="font-bold text-lg text-primary">{report?.totalStudents || 0} คน</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">เฉลี่ยเซสชันต่อนักเรียน</span>
                <span className="font-bold text-lg">
                  {report?.avgSessionsPerStudent?.toFixed(1) || 0} เซสชัน
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">เฉลี่ยข้อความต่อเซสชัน</span>
                <span className="font-bold text-lg">
                  {report?.avgMessagesPerSession?.toFixed(1) || 0} ข้อความ
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/5">
                <span className="text-sm text-muted-foreground">อัตราการมีส่วนร่วม</span>
                <span className="font-bold text-lg text-green-500">
                  {report?.totalStudents 
                    ? Math.round((report.totalSessions / report.totalStudents) * 100) 
                    : 0}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                นักเรียนที่ใช้งานมากที่สุด
              </CardTitle>
              <CardDescription>Top 5 นักเรียนที่มีการสนทนามากที่สุด</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report?.topStudents && report.topStudents.length > 0 ? (
                  report.topStudents.map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {student.sessionCount}
                        </div>
                        <div className="text-xs text-muted-foreground">เซสชัน</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">ยังไม่มีข้อมูล</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              ส่งออกรายงาน
            </CardTitle>
            <CardDescription>ดาวน์โหลดรายงานในรูปแบบต่างๆ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="gap-2 h-auto py-4 flex-col" onClick={() => handleExport("users")}>
                <FileText className="h-6 w-6 mb-1" />
                <span className="font-semibold">รายงานผู้ใช้</span>
                <span className="text-xs text-muted-foreground">CSV Format</span>
              </Button>
              <Button variant="outline" className="gap-2 h-auto py-4 flex-col" onClick={() => handleExport("sessions")}>
                <MessageSquare className="h-6 w-6 mb-1" />
                <span className="font-semibold">รายงานการสนทนา</span>
                <span className="text-xs text-muted-foreground">CSV Format</span>
              </Button>
              <Button variant="outline" className="gap-2 h-auto py-4 flex-col" onClick={handleExportPDF}>
                <TrendingUp className="h-6 w-6 mb-1" />
                <span className="font-semibold">รายงานสถิติ</span>
                <span className="text-xs text-muted-foreground">PDF Format</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
