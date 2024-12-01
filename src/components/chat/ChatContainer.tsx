import React from 'react';
import { ChatRoom } from './ChatRoom';
import { useChat } from '@/hooks/useChat';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ChatContainerProps {
  roomId: string;
  userId: string;
  userName: string;
}

export function ChatContainer({ roomId, userId, userName }: ChatContainerProps) {
  const { 
    messages, 
    loading, 
    error, 
    sendMessage, 
    addReaction 
  } = useChat(roomId);

  if (loading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full flex items-center justify-center text-destructive">
        <p>Failed to load chat: {error.message}</p>
      </Card>
    );
  }

  const handleSendMessage = (text: string) => {
    sendMessage(text, userId, userName);
  };

  const handleAddReaction = (messageId: string, reaction: string) => {
    addReaction(messageId, userId, reaction);
  };

  return (
    <ChatRoom
      roomId={roomId}
      userId={userId}
      userName={userName}
      messages={messages}
      onSendMessage={handleSendMessage}
      onAddReaction={handleAddReaction}
    />
  );
}