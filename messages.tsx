import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ChatInterface from "@/polymet/components/chat-interface";
import { ALL_CLIENTS } from "@/polymet/data/clients-data";
import { SearchIcon, MessageSquare } from "lucide-react";

interface ClientWithMessages extends typeof ALL_CLIENTS[0] {
  unreadCount: number;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
}

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Add message data to clients
  const clientsWithMessages: ClientWithMessages[] = ALL_CLIENTS.map((client) => {
    // Generate random unread count (0-3)
    const unreadCount = Math.floor(Math.random() * 4);
    
    // Generate a random last message for some clients
    const hasLastMessage = Math.random() > 0.3;
    const lastMessage = hasLastMessage
      ? {
          content: [
            "Thanks for the information!",
            "I'll review the documents and get back to you.",
            "When do you need this completed by?",
            "Could you clarify something about the agreement?",
          ][Math.floor(Math.random() * 4)],
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
        }
      : undefined;
    
    return {
      ...client,
      unreadCount,
      lastMessage,
    };
  });

  // Filter clients based on search query and active tab
  const filteredClients = clientsWithMessages.filter((client) => {
    const matchesSearch =
      searchQuery === "" ||
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && client.unreadCount > 0);
    
    return matchesSearch && matchesTab;
  });

  // Sort clients: unread first, then by last message timestamp
  const sortedClients = [...filteredClients].sort((a, b) => {
    // Unread messages first
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
    
    // Then by last message timestamp (if available)
    if (a.lastMessage && b.lastMessage) {
      return b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime();
    }
    
    // Clients with messages before those without
    if (a.lastMessage && !b.lastMessage) return -1;
    if (!a.lastMessage && b.lastMessage) return 1;
    
    // Finally by name
    return a.name.localeCompare(b.name);
  });

  // Find the selected client
  const selectedClientData = selectedClient
    ? clientsWithMessages.find((client) => client.id === selectedClient)
    : null;

  // Format timestamp for display
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Communicate with Your Clients</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Client list */}
        <Card className="md:col-span-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Conversations</CardTitle>
          </CardHeader>
          <div className="px-6 pb-3">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="px-6 pb-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  Unread
                  <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                    {clientsWithMessages.reduce((sum, client) => sum + client.unreadCount, 0)}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <ScrollArea className="flex-1">
            <div className="px-3">
              {sortedClients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No clients found
                </div>
              ) : (
                sortedClients.map((client) => (
                  <button
                    key={client.id}
                    className={`w-full text-left p-3 rounded-lg mb-1 hover:bg-muted transition-colors ${
                      selectedClient === client.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedClient(client.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://github.com/polymet-ai.png`} alt={client.name} />
                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium truncate">{client.name}</p>
                          {client.lastMessage && (
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(client.lastMessage.timestamp)}
                            </span>
                          )}
                        </div>
                        {client.lastMessage ? (
                          <p className="text-sm text-muted-foreground truncate">
                            {client.lastMessage.content}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            No messages yet
                          </p>
                        )}
                      </div>
                      {client.unreadCount > 0 && (
                        <Badge className="bg-orange-500 text-white">
                          {client.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat interface */}
        <Card className="md:col-span-2 flex flex-col">
          {selectedClientData ? (
            <ChatInterface
              clientName={selectedClientData.name}
              clientAvatar={`https://github.com/polymet-ai.png`}
              professionalName="Takashi Yamada"
              professionalAvatar="https://github.com/kdrnp.png"
              initialMessages={[]}
              className="border-0 rounded-none h-full"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
              <p className="text-muted-foreground max-w-md">
                Select a client from the list to start messaging or continue a conversation.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}