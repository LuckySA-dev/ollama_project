"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ChatInterface from "@/components/chat/ChatInterface";

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b flex-shrink-0">
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

      {/* Chat Interface */}
      <div className="flex-1 container mx-auto px-4 py-6 overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm h-full">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
