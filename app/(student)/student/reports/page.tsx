"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ReportCard from "@/components/report/ReportCard";
import type { Report } from "@/types";

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/report/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setReports(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: "WEEKLY" | "MONTHLY") => {
    setGenerating(true);
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/report/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reportType: type }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchReports();
      }
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setGenerating(false);
    }
  };

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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Your Reports</h2>
            <p className="text-gray-600">Track your progress and get personalized insights</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => generateReport("WEEKLY")} disabled={generating}>
              Generate Weekly Report
            </Button>
            <Button onClick={() => generateReport("MONTHLY")} variant="outline" disabled={generating}>
              Generate Monthly Report
            </Button>
          </div>
        </div>

        {loading ? (
          <p>Loading reports...</p>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No reports yet. Generate your first report!</p>
            <Button onClick={() => generateReport("WEEKLY")}>Generate Weekly Report</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report: Report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
