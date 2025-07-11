import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, User, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

// Types
interface Message {
  id: number;
  content: string;
  createdAt: string;
  sender: {
    id: number;
    username: string;
    fullName: string;
    userType: string;
  };
}

interface Conversation {
  id: number;
  name: string | null;
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
  participants: Array<{
    id: number;
    username: string;
    fullName: string;
    userType: string;
  }>;
}

function ConversationList({ 
  conversations, 
  onSelect, 
  selectedId 
}: { 
  conversations: Conversation[];
  onSelect: (conversation: Conversation) => void;
  selectedId: number | null;
}) {
  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-muted-foreground">No conversations yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      {conversations.map((conversation) => (
        <div 
          key={conversation.id} 
          className={`flex items-center gap-3 p-3 hover:bg-secondary/50 cursor-pointer ${selectedId === conversation.id ? 'bg-secondary' : ''}`}
          onClick={() => onSelect(conversation)}
        >
          {conversation.isGroup ? (
            <div className="bg-primary/10 p-2 rounded-full">
              <Users size={20} className="text-primary" />
            </div>
          ) : (
            <Avatar>
              <AvatarFallback>
                {conversation.participants[0]?.fullName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">
              {conversation.isGroup 
                ? conversation.name
                : conversation.participants[0]?.fullName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {conversation.isGroup 
                ? `${conversation.participants.length} members`
                : conversation.participants[0]?.userType}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
          </div>
        </div>
      ))}
    </ScrollArea>
  );
}

function NewConversationForm({ 
  onClose 
}: { 
  onClose: () => void 
}) {
  const [users, setUsers] = useState<Array<{ id: number; fullName: string; userType: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Array<number>>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const res = await apiRequest("GET", "/api/users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const createConversationMutation = useMutation({
    mutationFn: async (data: { participantIds: number[] }) => {
      const res = await apiRequest("POST", "/api/conversations", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      toast({
        title: "Conversation created",
        description: "You can now start chatting",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create conversation",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUsers.length === 0) {
      toast({
        title: "Please select at least one user",
        variant: "destructive",
      });
      return;
    }

    createConversationMutation.mutate({
      participantIds: selectedUsers,
    });
  };

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isLoading}
        />
        <ScrollArea className="h-[200px] border rounded-md p-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex justify-center items-center h-full text-muted-foreground">
              No users found
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-secondary ${
                    selectedUsers.includes(user.id) ? "bg-secondary" : ""
                  }`}
                  onClick={() => {
                    setSelectedUsers((prev) =>
                      prev.includes(user.id)
                        ? prev.filter((id) => id !== user.id)
                        : [...prev, user.id]
                    );
                  }}
                >
                  <Avatar>
                    <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user.userType}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || selectedUsers.length === 0 || createConversationMutation.isPending}
        >
          {createConversationMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Conversation"
          )}
        </Button>
      </div>
    </form>
  );
}

function ChatMessages({ 
  conversationId, 
  currentUserId 
}: { 
  conversationId: number;
  currentUserId: number;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: messages, isLoading } = useQuery({
    queryKey: [`/api/conversations/${conversationId}/messages`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/conversations/${conversationId}/messages`);
      return res.json() as Promise<Message[]>;
    },
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", `/api/conversations/${conversationId}/messages`, { content });
      return res.json();
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData(
        [`/api/conversations/${conversationId}/messages`],
        (old: Message[] = []) => [...old, newMessage]
      );
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    sendMessageMutation.mutate(newMessage.trim());
    setNewMessage("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        {messages && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {messages?.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender.id === currentUserId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender.id === currentUserId
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  {message.sender.id !== currentUserId && (
                    <p className="text-xs font-medium mb-1">
                      {message.sender.fullName}
                    </p>
                  )}
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sendMessageMutation.isPending}
          />
          <Button type="submit" size="icon" disabled={sendMessageMutation.isPending}>
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showNewConversation, setShowNewConversation] = useState(false);

  // Query to fetch conversations
  const { data: conversations, isLoading } = useQuery({
    queryKey: ["/api/conversations"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/conversations");
      return res.json() as Promise<Conversation[]>;
    },
  });

  // Create a new conversation form or show existing conversations
  const renderSidebar = () => {
    if (showNewConversation) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>New Conversation</CardTitle>
          </CardHeader>
          <CardContent>
            <NewConversationForm onClose={() => setShowNewConversation(false)} />
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Conversations</CardTitle>
          <Button 
            onClick={() => setShowNewConversation(true)}
            size="sm"
          >
            New Chat
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <ConversationList 
              conversations={conversations || []} 
              onSelect={setSelectedConversation}
              selectedId={selectedConversation?.id || null}
            />
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container py-6 h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-12 gap-6 h-full">
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
          {renderSidebar()}
        </div>
        <div className="col-span-12 md:col-span-8 lg:col-span-9 h-full">
          {selectedConversation ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b py-3">
                <div className="flex items-center gap-2">
                  {selectedConversation.isGroup ? (
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users size={20} className="text-primary" />
                    </div>
                  ) : (
                    <Avatar>
                      <AvatarFallback>
                        {selectedConversation.participants[0]?.fullName?.charAt(0) || <User />}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <CardTitle className="text-lg">
                      {selectedConversation.isGroup 
                        ? selectedConversation.name 
                        : selectedConversation.participants[0]?.fullName}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {selectedConversation.isGroup 
                        ? `${selectedConversation.participants.length} members` 
                        : selectedConversation.participants[0]?.userType}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                {user && (
                  <ChatMessages 
                    conversationId={selectedConversation.id} 
                    currentUserId={user.id}
                  />
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center space-y-2">
                <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium">No conversation selected</h3>
                <p className="text-muted-foreground">
                  Select a conversation from the sidebar or create a new one
                </p>
                <Button 
                  onClick={() => setShowNewConversation(true)}
                  className="mt-4"
                >
                  Start a new conversation
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}