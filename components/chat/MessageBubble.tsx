import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ChatMessage } from "@/types";
import { Bot, User } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[80%] space-x-2 ${
          isUser ? "flex-row-reverse space-x-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? "bg-primary" : "bg-secondary"
          }`}
        >
          {isUser ? (
            <User className="w-4 h-4 text-primary-foreground" />
          ) : (
            <Bot className="w-4 h-4 text-secondary-foreground" />
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col space-y-1">
          <div
            className={`rounded-lg px-4 py-2 ${
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            }`}
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>

          {/* Metadata */}
          <div className={`flex items-center space-x-2 px-1 ${isUser ? "justify-end" : "justify-start"}`}>
            <span className="text-xs text-muted-foreground">
              {formatDateTime(message.timestamp)}
            </span>
            {message.behaviorTags && message.behaviorTags.length > 0 && (
              <div className="flex space-x-1">
                {message.behaviorTags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
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
