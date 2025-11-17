"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/layout/AdminNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Save, Database, Bell, Shield, Zap } from "lucide-react";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    systemName: "StudyBuddy",
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    autoBackup: true,
    maxSessionsPerDay: 10,
    sessionTimeout: 30,
  });

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      router.push("/login");
      return;
    }
    loadSettings();
  }, [router]);

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/admin/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      if (data.success) {
        alert("บันทึกการตั้งค่าเรียบร้อยแล้ว!");
      } else {
        alert(`เกิดข้อผิดพลาด: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกการตั้งค่า");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">ตั้งค่าระบบ</h1>
          <p className="text-muted-foreground text-lg">จัดการการตั้งค่าและการกำหนดค่าระบบ</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <CardTitle>การตั้งค่าทั่วไป</CardTitle>
              </div>
              <CardDescription>ตั้งค่าพื้นฐานของระบบ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="systemName">ชื่อระบบ</Label>
                <Input
                  id="systemName"
                  value={settings.systemName}
                  onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>โหมดบำรุงรักษา</Label>
                  <p className="text-sm text-muted-foreground">
                    ปิดระบบชั่วคราวเพื่อบำรุงรักษา
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked: boolean) =>
                    setSettings({ ...settings, maintenanceMode: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>เปิดการสมัครสมาชิก</Label>
                  <p className="text-sm text-muted-foreground">
                    อนุญาตให้ผู้ใช้ใหม่สมัครสมาชิก
                  </p>
                </div>
                <Switch
                  checked={settings.allowRegistration}
                  onCheckedChange={(checked: boolean) =>
                    setSettings({ ...settings, allowRegistration: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <CardTitle>การแจ้งเตือน</CardTitle>
              </div>
              <CardDescription>ตั้งค่าการแจ้งเตือนและอีเมล</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>การแจ้งเตือนทางอีเมล</Label>
                  <p className="text-sm text-muted-foreground">
                    ส่งอีเมลแจ้งเตือนเหตุการณ์สำคัญ
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked: boolean) =>
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <CardTitle>ความปลอดภัย</CardTitle>
              </div>
              <CardDescription>ตั้งค่าความปลอดภัยและการเข้าถึง</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxSessions">จำนวนเซสชันสูงสุดต่อวัน</Label>
                <Input
                  id="maxSessions"
                  type="number"
                  value={settings.maxSessionsPerDay}
                  onChange={(e) =>
                    setSettings({ ...settings, maxSessionsPerDay: parseInt(e.target.value) })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  จำกัดจำนวนเซสชันที่นักเรียนสามารถสร้างได้ต่อวัน
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">หมดเวลาเซสชัน (นาที)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  เซสชันจะหมดอายุหลังจากไม่มีการใช้งาน
                </p>
              </div>
            </CardContent>
          </Card>

          {/* System Maintenance */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <CardTitle>การบำรุงรักษาระบบ</CardTitle>
              </div>
              <CardDescription>เครื่องมือสำหรับการบำรุงรักษา</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>สำรองข้อมูลอัตโนมัติ</Label>
                  <p className="text-sm text-muted-foreground">
                    สำรองข้อมูลทุกวันเวลา 00:00
                  </p>
                </div>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(checked: boolean) =>
                    setSettings({ ...settings, autoBackup: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full gap-2">
                  <Database className="h-4 w-4" />
                  สำรองข้อมูลทันที
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Zap className="h-4 w-4" />
                  ล้างแคช
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} disabled={loading} className="gap-2" size="lg">
            <Save className="h-4 w-4" />
            {loading ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
          </Button>
        </div>
      </div>
    </div>
  );
}
