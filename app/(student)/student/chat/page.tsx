"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ChatInterface from "@/components/chat/ChatInterface";
import SessionList from "@/components/chat/SessionList";
import StudentNavbar from "@/components/layout/StudentNavbar";
import { Menu, X, Plus } from "lucide-react";

export default function ChatPage() {
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleNewChat = () => {
    setSelectedSessionId(undefined);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Navbar */}
      <StudentNavbar />

      {/* Main Content with Sidebar */}
      <div className="flex-1 overflow-hidden flex">
        {/* Session List Sidebar */}
        <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 border-r bg-card overflow-hidden flex-shrink-0`}>
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold text-lg">ประวัติการสนทนา</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNewChat}
                title="เริ่มการสนทนาใหม่"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Session List */}
            <div className="flex-1 overflow-y-auto">
              <SessionList
                onSelectSession={(sessionId) => {
                  setSelectedSessionId(sessionId);
                }}
                currentSessionId={selectedSessionId}
              />
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toggle Sidebar Button */}
          <div className="p-2 border-b bg-card flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="gap-2"
            >
              {showSidebar ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span className="text-sm">{showSidebar ? 'ซ่อนประวัติ' : 'แสดงประวัติ'}</span>
            </Button>
            {selectedSessionId && (
              <span className="text-sm text-muted-foreground">
                กำลังดูการสนทนาที่เลือก
              </span>
            )}
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-hidden">
            <ChatInterface 
              sessionId={selectedSessionId}
              onMessageSent={() => {
                // Refresh session list after sending message
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
