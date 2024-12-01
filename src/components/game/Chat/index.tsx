// src/components/game/Chat/index.tsx
import React from 'react';
import { useChatStore } from '@/stores/chatStore';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Chat() {
  const { messages, sendMessage } = useChatStore();
  const [message, setMessage] = React.useState('');

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <Card className='h-[400px] flex flex-col'>
      <div className='flex-1 overflow-y-auto p-4 space-y-2'>
        {messages.map((msg, i) => (
          <div key={i} className='p-2 bg-gray-50 rounded-lg'>
            <span className='font-bold'>{msg.user}:</span> {msg.text}
          </div>
        ))}
      </div>

      <div className='p-4 border-t flex gap-2'>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Type a message...'
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </Card>
  );
}
