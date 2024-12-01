// src/features/ai/ClaudeService.tsx
import { Anthropic } from '@anthropic-ai/sdk';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Brain, MessageSquare, Sparkles, HelpCircle } from 'lucide-react';

interface ClaudeResponse {
  type: 'chat' | 'game' | 'help';
  content: string;
  action?: {
    type: 'suggest_number' | 'validate_pattern' | 'explain_rule';
    data: any;
  };
}

export class ClaudeAssistant {
  private anthropic: Anthropic;
  private context: string;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    });

    this.context = `You are assisting players in BingoBetFun, a social streaming bingo platform. 
    You can help with game rules, strategy, and create a fun atmosphere. You should be friendly, 
    encouraging, and maintain the excitement of the game.`;
  }

  async interact(message: string, gameState?: any): Promise<ClaudeResponse> {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `${this.context}\n\nUser message: ${message}\n${
              gameState ? `Current game state: ${JSON.stringify(gameState)}` : ''
            }`,
          },
        ],
      });

      return this.processResponse(response.content[0].text);
    } catch (error) {
      console.error('Claude interaction error:', error);
      return {
        type: 'chat',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
      };
    }
  }

  private processResponse(response: string): ClaudeResponse {
    // Process response and extract any actions
    if (response.includes('PATTERN_CHECK')) {
      return {
        type: 'game',
        content: response.replace('PATTERN_CHECK:', ''),
        action: {
          type: 'validate_pattern',
          data: { pattern: 'suggested_pattern' },
        },
      };
    }

    if (response.includes('NEXT_NUMBER')) {
      return {
        type: 'game',
        content: response,
        action: {
          type: 'suggest_number',
          data: { number: this.generateNumberSuggestion() },
        },
      };
    }

    return {
      type: 'chat',
      content: response,
    };
  }

  private generateNumberSuggestion(): number {
    return Math.floor(Math.random() * 75) + 1;
  }
}

// src/components/ClaudeAssistantWidget.tsx
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ClaudeAssistantWidgetProps {
  onAssistantResponse?: (response: ClaudeResponse) => void;
  gameState?: any;
}

export const ClaudeAssistantWidget: React.FC<ClaudeAssistantWidgetProps> = ({
  onAssistantResponse,
  gameState,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    Array<{
      role: 'user' | 'assistant';
      content: string;
      timestamp: Date;
    }>
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const claudeService = useRef(new ClaudeAssistant());

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: message,
        timestamp: new Date(),
      },
    ]);

    setIsTyping(true);
    try {
      const response = await claudeService.current.interact(message, gameState);

      // Add Claude's response
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.content,
          timestamp: new Date(),
        },
      ]);

      onAssistantResponse?.(response);
    } catch (error) {
      console.error('Error getting Claude response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      <Button onClick={() => setIsOpen(!isOpen)} className='rounded-full h-12 w-12 shadow-lg'>
        <Brain className='h-6 w-6' />
      </Button>

      {isOpen && (
        <Card className='absolute bottom-14 right-0 w-80 h-96 flex flex-col'>
          <CardContent className='flex-1 p-4'>
            <div className='flex items-center gap-2 mb-4'>
              <Sparkles className='h-5 w-5 text-primary' />
              <span className='font-semibold'>Claude Assistant</span>
            </div>

            <div className='h-full flex flex-col'>
              <div className='flex-1 overflow-y-auto space-y-4'>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-2 ${
                        msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100'
                      }`}
                    >
                      <p className='text-sm'>{msg.content}</p>
                      <span className='text-xs opacity-70'>
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className='flex gap-2 items-center text-gray-500'>
                    <div className='animate-pulse'>Claude is typing...</div>
                  </div>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
                  handleSendMessage(input.value);
                  input.value = '';
                }}
                className='mt-4 flex gap-2'
              >
                <input
                  type='text'
                  name='message'
                  placeholder='Ask Claude anything...'
                  className='flex-1 px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50'
                />
                <Button type='submit' size='sm'>
                  <MessageSquare className='h-4 w-4' />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Help Button */}
      <Button
        variant='outline'
        size='sm'
        className='absolute bottom-0 right-14 ml-2'
        onClick={() => handleSendMessage("What's the current game pattern?")}
      >
        <HelpCircle className='h-4 w-4 mr-2' />
        Quick Help
      </Button>
    </div>
  );
};
