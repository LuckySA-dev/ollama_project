"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatsCard from "@/components/dashboard/StatsCard";
import BehaviorChart from "@/components/dashboard/BehaviorChart";
import { Button } from "@/components/ui/button";
import { MessageSquare, TrendingUp, Award, Flame, FileText } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">StudyBuddy</h1>
          <nav className="flex gap-4">
            <Link href="/student/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/student/chat">
              <Button variant="ghost">Chat</Button>
            </Link>
            <Link href="/student/reports">
              <Button variant="ghost">Reports</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-gray-600">Here's how your study habits are looking this week.</p>
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
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/student/chat">
            <div className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
              <MessageSquare className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">Start a Chat</h3>
              <p className="text-gray-600">
                Talk to StudyBuddy about your study challenges or questions.
              </p>
            </div>
          </Link>

          <Link href="/student/reports">
            <div className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
              <FileText className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">View Reports</h3>
              <p className="text-gray-600">
                Check your weekly progress reports and recommendations.
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
