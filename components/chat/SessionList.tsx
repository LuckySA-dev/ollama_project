"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import { MessageSquare, Clock, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Session {
  id: string;
  startedAt: Date;
  endedAt: Date | null;
  messageCount: number;
  lastMessageAt: Date;
  preview: string;
  hasSummary: boolean;
}

interface SessionListProps {
  onSelectSession?: (sessionId: string) => void;
  currentSessionId?: string;
}

export default function SessionList({ onSelectSession, currentSessionId }: SessionListProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/chat/sessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setSessions(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-sm text-muted-foreground">กำลังโหลด...</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="p-4 text-center">
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">ยังไม่มีประวัติการสนทนา</p>
        <p className="text-xs text-muted-foreground mt-1">
          เริ่มสนทนากับ AI Mentor เพื่อดูประวัติที่นี่
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      <div className="px-2 mb-4">
        <h3 className="font-semibold text-sm">ประวัติการสนทนา</h3>
        <p className="text-xs text-muted-foreground">
          {sessions.length} การสนทนา
        </p>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {sessions.map((session) => (
          <Card
            key={session.id}
            className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
              currentSessionId === session.id ? "bg-accent border-primary" : ""
            }`}
            onClick={() => onSelectSession?.(session.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">
                  {session.messageCount} ข้อความ
                </span>
              </div>
              {session.hasSummary && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>

            <p className="text-sm line-clamp-2 mb-2">{session.preview}</p>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(session.lastMessageAt), {
                  addSuffix: true,
                  locale: th,
                })}
              </span>
            </div>

            {session.endedAt && (
              <div className="mt-1 text-xs text-muted-foreground">
                ระยะเวลา:{" "}
                {Math.round(
                  (new Date(session.endedAt).getTime() -
                    new Date(session.startedAt).getTime()) /
                    60000
                )}{" "}
                นาที
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
