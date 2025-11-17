"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentNavbar from "@/components/layout/StudentNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  MessageSquare, 
  Brain, 
  Target, 
  Activity,
  Calendar,
  Clock,
  BarChart3,
  Eye,
  ChevronRight
} from "lucide-react";

interface ChatSession {
  id: string;
  startedAt: string;
  sessionSummary: string | null;
  messageCount: number;
  behaviorTags: string[];
}

interface BehaviorStat {
  behaviorType: string;
  count: number;
  averageIntensity: number;
}

interface ProgressData {
  chatSessions: ChatSession[];
  behaviorStats: BehaviorStat[];
  weeklyScores: Array<{
    weekStartDate: string;
    focusScore: number;
    motivationScore: number;
    stressLevel: number;
  }>;
  totalMessages: number;
}

export default function ProgressPage() {
  const router = useRouter();
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/student/progress", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch progress data:", error);
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
      <StudentNavbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">ความก้าวหน้าของคุณ</h1>
              <p className="text-muted-foreground">ติดตามพัฒนาการและพฤติกรรมการเรียนของคุณ</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-3xl font-bold">{data?.chatSessions.length || 0}</div>
              </div>
              <div className="text-sm font-medium">การสนทนาทั้งหมด</div>
              <div className="text-xs text-muted-foreground">เซสชันที่สร้าง</div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-500" />
                </div>
                <div className="text-3xl font-bold">{data?.totalMessages || 0}</div>
              </div>
              <div className="text-sm font-medium">ข้อความทั้งหมด</div>
              <div className="text-xs text-muted-foreground">ที่คุณส่ง</div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-purple-500" />
                </div>
                <div className="text-3xl font-bold">{data?.behaviorStats.length || 0}</div>
              </div>
              <div className="text-sm font-medium">ประเภทพฤติกรรม</div>
              <div className="text-xs text-muted-foreground">ที่ระบุ</div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-orange-500" />
                </div>
                <div className="text-3xl font-bold">{data?.weeklyScores.length || 0}</div>
              </div>
              <div className="text-sm font-medium">สัปดาห์ที่บันทึก</div>
              <div className="text-xs text-muted-foreground">คะแนนพฤติกรรม</div>
            </CardContent>
          </Card>
        </div>

        {/* Behavior Statistics */}
        {data?.behaviorStats && data.behaviorStats.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                สถิติพฤติกรรมการเรียน
              </CardTitle>
              <CardDescription>พฤติกรรมที่ระบุในการสนทนา</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.behaviorStats.map((stat, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{stat.behaviorType}</span>
                      <Badge variant="secondary">{stat.count}x</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(stat.averageIntensity / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {stat.averageIntensity.toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weekly Scores Trend */}
        {data?.weeklyScores && data.weeklyScores.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                แนวโน้มคะแนนรายสัปดาห์
              </CardTitle>
              <CardDescription>คะแนนพฤติกรรมการเรียนแต่ละสัปดาห์</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.weeklyScores.map((score, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {new Date(score.weekStartDate).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">สมาธิ</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${score.focusScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">{score.focusScore}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">แรงจูงใจ</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500 rounded-full"
                              style={{ width: `${score.motivationScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">{score.motivationScore}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">ความเครียด</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-orange-500 rounded-full"
                              style={{ width: `${score.stressLevel}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">{score.stressLevel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              ประวัติการสนทนา
            </CardTitle>
            <CardDescription>ดูย้อนหลังการสนทนาและหัวข้อที่คุณพูดคุย</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.chatSessions && data.chatSessions.length > 0 ? (
              <div className="space-y-3">
                {data.chatSessions.map((session) => (
                  <div 
                    key={session.id}
                    className="p-4 rounded-lg border bg-card hover:border-primary/50 transition-all cursor-pointer"
                    onClick={() => router.push(`/student/chat?session=${session.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(session.startedAt).toLocaleDateString('th-TH', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {session.sessionSummary && (
                          <p className="text-sm font-medium mb-2">{session.sessionSummary}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MessageSquare className="h-3 w-3" />
                          <span>{session.messageCount} ข้อความ</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        ดู
                      </Button>
                    </div>
                    {session.behaviorTags && session.behaviorTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {session.behaviorTags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">ยังไม่มีการสนทนา</p>
                <Button onClick={() => router.push("/student/chat")}>
                  เริ่มการสนทนาแรก
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
