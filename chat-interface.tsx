import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SendIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "client" | "professional";
  timestamp: Date;
}

interface ChatInterfaceProps {
  clientName: string;
  clientAvatar: string;
  professionalName: string;
  professionalAvatar: string;
  initialMessages: Message[];
  className?: string;
}

export default function ChatInterface({
  clientName,
  clientAvatar,
  professionalName,
  professionalAvatar,
  initialMessages = [],
  className,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      sender: "professional",
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate client response after a delay (for demo purposes)
    setTimeout(() => {
      const clientResponse: Message = {
        id: `msg-${Date.now() + 1}`,
        content: `Thank you for your message. I'll get back to you soon.`,
        sender: "client",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, clientResponse]);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full border rounded-lg overflow-hidden bg-white dark:bg-gray-950",
        className
      )}
    >
      {/* Chat header */}
      <div className="flex items-center p-4 border-b bg-muted/30">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={clientAvatar} alt={clientName} />

          <AvatarFallback>{clientName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{clientName}</h3>
          <p className="text-xs text-muted-foreground">Active now</p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <p className="text-muted-foreground mb-2">No messages yet</p>
            <p className="text-sm text-muted-foreground">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "flex items-end gap-2 max-w-[80%]",
                message.sender === "professional"
                  ? "ml-auto flex-row-reverse"
                  : ""
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={
                    message.sender === "professional"
                      ? professionalAvatar
                      : clientAvatar
                  }
                  alt={
                    message.sender === "professional"
                      ? professionalName
                      : clientName
                  }
                />

                <AvatarFallback>
                  {message.sender === "professional"
                    ? professionalName[0]
                    : clientName[0]}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "rounded-lg p-3 text-sm",
                  message.sender === "professional"
                    ? "bg-orange-500 text-white"
                    : "bg-muted"
                )}
              >
                <p>{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 border-t flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />

        <Button
          onClick={handleSendMessage}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <SendIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
