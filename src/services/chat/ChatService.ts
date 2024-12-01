import { getDatabase, ref, set, push, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { LoggerService } from '@/services/logger';
import { EventEmitter } from '@/utils/events';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  type: 'chat' | 'system' | 'command';
  timestamp: number;
  mentions?: string[];
  replyTo?: string;
  reactions: Record<string, string[]>;
}

interface ChatOptions {
  maxMessages?: number;
  messageLimit?: number;
  enableReactions?: boolean;
  enableMentions?: boolean;
  enableCommands?: boolean;
}

export class ChatService extends EventEmitter {
  private db;
  private logger: LoggerService;
  private activeRooms: Map<string, () => void>;
  private messageCache: Map<string, ChatMessage[]>;

  constructor(private options: ChatOptions = {}) {
    super();
    this.db = getDatabase();
    this.logger = new LoggerService('ChatService');
    this.activeRooms = new Map();
    this.messageCache = new Map();
    
    this.options = {
      maxMessages: 100,
      messageLimit: 500,
      enableReactions: true,
      enableMentions: true,
      enableCommands: true,
      ...options
    };
  }

  /**
   * Conecta ao chat de uma sala
   */
  async joinRoom(roomId: string, callback: (messages: ChatMessage[]) => void): Promise<() => void> {
    if (this.activeRooms.has(roomId)) {
      return () => {};
    }

    const chatRef = query(
      ref(this.db, `chat_messages/${roomId}`),
      orderByChild('timestamp'),
      limitToLast(this.options.maxMessages!)
    );

    const unsubscribe = onValue(chatRef, (snapshot) => {
      const messages = [];
      snapshot.forEach((childSnapshot) => {
        messages.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });

      // Atualiza cache
      this.messageCache.set(roomId, messages);
      callback(messages);
      
      this.emit('messagesUpdated', { roomId, messages });
    });

    this.activeRooms.set(roomId, unsubscribe);
    return () => this.leaveRoom(roomId);
  }

  /**
   * Envia mensagem no chat
   */
  async sendMessage(
    roomId: string, 
    userId: string, 
    userName: string, 
    text: string
  ): Promise<ChatMessage> {
    // Valida e processa a mensagem
    if (!text.trim()) {
      throw new Error('Message cannot be empty');
    }

    // Extrai menções se habilitado
    const mentions = this.options.enableMentions ? 
      this.extractMentions(text) : undefined;

    // Processa comandos se habilitado
    if (this.options.enableCommands && text.startsWith('/')) {
      return this.handleCommand(roomId, userId, userName, text);
    }

    const message: ChatMessage = {
      id: '', // Será definido pelo Firebase
      userId,
      userName,
      text,
      type: 'chat',
      timestamp: Date.now(),
      mentions,
      reactions: {}
    };

    // Salva no Firebase
    const messageRef = push(ref(this.db, `chat_messages/${roomId}`));
    message.id = messageRef.key!;
    
    await set(messageRef, message);
    return message;
  }

  /**
   * Adiciona reação a uma mensagem
   */
  async addReaction(
    roomId: string, 
    messageId: string, 
    userId: string, 
    reaction: string
  ): Promise<void> {
    if (!this.options.enableReactions) {
      throw new Error('Reactions are disabled');
    }

    const messageRef = ref(this.db, `chat_messages/${roomId}/${messageId}/reactions/${reaction}`);
    const currentReactions = await this.getReactions(roomId, messageId, reaction);
    
    // Toggle reaction
    if (currentReactions.includes(userId)) {
      await set(messageRef, currentReactions.filter(id => id !== userId));
    } else {
      await set(messageRef, [...currentReactions, userId]);
    }
  }

  /**
   * Processa comandos do chat
   */
  private async handleCommand(
    roomId: string,
    userId: string,
    userName: string,
    text: string
  ): Promise<ChatMessage> {
    const [command, ...args] = text.slice(1).split(' ');

    // Comandos básicos
    switch (command.toLowerCase()) {
      case 'clear':
        if (await this.isAdmin(userId)) {
          await this.clearChat(roomId);
          return this.createSystemMessage(`Chat cleared by ${userName}`);
        }
        break;
      
      case 'help':
        return this.createSystemMessage(this.getHelpText());
        
      default:
        return this.createSystemMessage(`Unknown command: ${command}`);
    }

    throw new Error('Command failed');
  }

  /**
   * Métodos auxiliares
   */
  private extractMentions(text: string): string[] {
    const mentions = text.match(/@(\w+)/g);
    return mentions ? mentions.map(m => m.slice(1)) : [];
  }

  private async getReactions(
    roomId: string, 
    messageId: string, 
    reaction: string
  ): Promise<string[]> {
    const reactionsRef = ref(this.db, `chat_messages/${roomId}/${messageId}/reactions/${reaction}`);
    const snapshot = await get(reactionsRef);
    return snapshot.val() || [];
  }

  private createSystemMessage(text: string): ChatMessage {
    return {
      id: `system-${Date.now()}`,
      userId: 'system',
      userName: 'System',
      text,
      type: 'system',
      timestamp: Date.now(),
      reactions: {}
    };
  }

  private async isAdmin(userId: string): Promise<boolean> {
    // Implementar verificação de admin
    return true;
  }

  private getHelpText(): string {
    return `Available commands:
/clear - Clear chat (admin only)
/help - Show this help`;
  }

  /**
   * Desconecta do chat
   */
  private leaveRoom(roomId: string): void {
    const unsubscribe = this.activeRooms.get(roomId);
    if (unsubscribe) {
      unsubscribe();
      this.activeRooms.delete(roomId);
      this.messageCache.delete(roomId);
    }
  }

  /**
   * Limpa o chat
   */
  private async clearChat(roomId: string): Promise<void> {
    await set(ref(this.db, `chat_messages/${roomId}`), null);
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.activeRooms.forEach(unsubscribe => unsubscribe());
    this.activeRooms.clear();
    this.messageCache.clear();
  }
}