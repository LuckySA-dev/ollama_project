"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import MessageBubble from "./MessageBubble";
import type { ChatMessage } from "@/types";

interface ChatInterfaceProps {
  sessionId?: string;
  onMessageSent?: (message: string) => void;
}

export default function ChatInterface({ sessionId, onMessageSent }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages when sessionId changes
  useEffect(() => {
    if (sessionId) {
      loadSessionMessages(sessionId);
    } else {
      // Clear messages for new chat
      setMessages([]);
    }
  }, [sessionId]);

  const loadSessionMessages = async (sessionId: string) => {
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) return;

      const response = await fetch(`/api/chat/session/${sessionId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success && data.data) {
        const loadedMessages: ChatMessage[] = data.data.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          behaviorTags: msg.behaviorTags || [],
        }));
        setMessages(loadedMessages);
      }
    } catch (error) {
      console.error("Failed to load session messages:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("auth-token");
      
      if (!token) {
        console.error("No auth token found");
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: "Please log in again to continue chatting.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }
      
      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          message: input,
          sessionId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage: ChatMessage = {
          id: data.data.messageId,
          role: "assistant",
          content: data.data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        onMessageSent?.(input);
      } else {
        // Show error message to user
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: `Sorry, I couldn't process your message. ${data.error || "Please try again."}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Show error message to user
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I'm having trouble connecting. Please check your internet connection and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-muted-foreground">กำลังโหลดประวัติการสนทนา...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <span className="text-4xl">🤖</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                สวัสดีค่ะ! ฉันคือ AI Mentor
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                ฉันพร้อมช่วยเหลือคุณในเรื่องการเรียนและพฤติกรรมการเรียน
                <br />
                ถามอะไรมาได้เลยนะคะ 😊
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-accent/50 text-left hover:bg-accent/70 transition-colors">
                  <div className="font-medium mb-1">💡 การจัดการเวลา</div>
                  <div className="text-xs text-muted-foreground">วางแผนการเรียน</div>
                </div>
                <div className="p-3 rounded-lg bg-accent/50 text-left hover:bg-accent/70 transition-colors">
                  <div className="font-medium mb-1">📚 เทคนิคการเรียน</div>
                  <div className="text-xs text-muted-foreground">เพิ่มประสิทธิภาพ</div>
                </div>
                <div className="p-3 rounded-lg bg-accent/50 text-left hover:bg-accent/70 transition-colors">
                  <div className="font-medium mb-1">🎯 ตั้งเป้าหมาย</div>
                  <div className="text-xs text-muted-foreground">บรรลุความสำเร็จ</div>
                </div>
                <div className="p-3 rounded-lg bg-accent/50 text-left hover:bg-accent/70 transition-colors">
                  <div className="font-medium mb-1">😌 จัดการความเครียด</div>
                  <div className="text-xs text-muted-foreground">สร้างสมดุล</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex items-center space-x-2 px-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm text-muted-foreground">AI กำลังตอบ...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-card p-4">
        <div className="flex items-end space-x-3 max-w-4xl mx-auto">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="พิมพ์ข้อความของคุณที่นี่... (Shift+Enter เพื่อขึ้นบรรทัดใหม่)"
            className="min-h-[56px] max-h-[200px] resize-none bg-background"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[56px] w-[56px] shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
