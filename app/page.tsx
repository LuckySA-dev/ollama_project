"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { BookOpen, Brain, TrendingUp, Shield, MessageSquare, BarChart3, FileText, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-primary">StudyBuddy</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">เข้าสู่ระบบ</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            AI Mentor สำหรับนักเรียนไทย
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
            เพื่อนคู่คิดด้านการเรียน
            <br />
            ที่ขับเคลื่อนด้วย AI
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            ผู้ช่วยด้านการเรียนที่ขับเคลื่อนด้วย AI ช่วยนักเรียนมัธยมต้นและมัธยมปลาย
            <br />
            สร้างนิสัยการเรียนที่ดีขึ้นด้วยคำแนะนำและข้อมูลเชิงลึกส่วนบุคคล
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6">
                เริ่มต้นใช้งาน
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                เข้าสู่ระบบ
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-xl">💬 AI Mentor</CardTitle>
              <CardDescription className="text-base">
                สนทนากับ AI ที่เข้าใจปัญหาการเรียนของคุณ
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-xl">📈 ติดตามความก้าวหน้า</CardTitle>
              <CardDescription className="text-base">
                ติดตามนิสัยการเรียนและดูการพัฒนาของคุณ
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-xl">📊 รายงานส่วนบุคคล</CardTitle>
              <CardDescription className="text-base">
                รับข้อมูลเชิงลึกและคำแนะนำรายสัปดาห์
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-xl">🔒 ปลอดภัยและเป็นส่วนตัว</CardTitle>
              <CardDescription className="text-base">
                เนื้อหาเหมาะสมกับวัย ความเป็นส่วนตัวได้รับการปกป้อง
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">วิธีการใช้งาน</h2>
            <p className="text-xl text-muted-foreground">เริ่มต้นใช้งานง่ายๆ ใน 3 ขั้นตอน</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden border-2">
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">สนทนากับ AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  แบ่งปันปัญหาการเรียน คำถาม หรือเป้าหมายของคุณ 
                  AI จะรับฟังและให้คำแนะนำที่เหมาะสมกับวัย
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2">
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">ติดตามพฤติกรรม</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  AI จะระบุรูปแบบในนิสัยการเรียนของคุณโดยอัตโนมัติ
                  เช่น สมาธิ แรงจูงใจ และระดับความเครียด
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2">
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">รับข้อมูลเชิงลึก</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  รับรายงานรายสัปดาห์พร้อมคำแนะนำที่ปฏิบัติได้จริง
                  เพื่อปรับปรุงนิสัยการเรียนและผลการเรียน
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold mb-4">พร้อมที่จะเริ่มต้นแล้วหรือยัง?</h3>
              <p className="text-xl text-muted-foreground mb-8">
                เข้าร่วมกับนักเรียนหลายพันคนที่กำลังปรับปรุงนิสัยการเรียนของพวกเขา
              </p>
              <Link href="/register">
                <Button size="lg" className="text-lg px-10 py-6">
                  สมัครใช้งานฟรี
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-lg">StudyBuddy</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-muted-foreground">
                &copy; 2024 StudyBuddy. สร้างด้วย AI เพื่อสนับสนุนความสำเร็จของนักเรียน
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                สำหรับนักเรียนมัธยมต้นและมัธยมปลาย (ม.1-ม.6)
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
