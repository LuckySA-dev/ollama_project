import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ChatMessage } from "@/types";
import { Bot, User } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  
  // Parse behaviorTags if it's a JSON string
  const behaviorTags = (() => {
    if (!message.behaviorTags) return [];
    if (Array.isArray(message.behaviorTags)) return message.behaviorTags;
    if (typeof message.behaviorTags === 'string') {
      try {
        const parsed = JSON.parse(message.behaviorTags);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  })();

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in fade-in-0 slide-in-from-bottom-2 duration-300`}>
      <div
        className={`flex max-w-[75%] space-x-3 ${
          isUser ? "flex-row-reverse space-x-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
            isUser 
              ? "bg-primary" 
              : "bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20"
          }`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-primary-foreground" />
          ) : (
            <Bot className="w-5 h-5 text-primary" />
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col space-y-2">
          <div
            className={`rounded-2xl px-4 py-3 shadow-sm ${
              isUser
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-card border border-border text-card-foreground rounded-tl-sm"
            }`}
          >
            <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">{message.content}</p>
          </div>

          {/* Metadata */}
          <div className={`flex items-center flex-wrap gap-2 px-2 ${isUser ? "justify-end" : "justify-start"}`}>
            <span className="text-xs text-muted-foreground">
              {formatDateTime(message.timestamp)}
            </span>
            {behaviorTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {behaviorTags.map((tag, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="text-xs px-2 py-0.5 font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
