// src/types/chat.ts

// Constants
export const CHAT_CONSTANTS = {
  MAX_MESSAGE_LENGTH: 500,
  MAX_PARTICIPANTS: 1000,
  RATE_LIMIT: 1000, // milliseconds between messages
  MAX_HISTORY: 1000,
} as const;

// Base Types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Message Types
export interface Message extends BaseEntity {
  content: string;
  userId: string;
  username: string;
  type: MessageType;
  metadata?: MessageMetadata;
  status: MessageStatus;
  reactions?: MessageReaction[];
  replyTo?: string; // ID of the message being replied to
}

export type MessageType =
  | 'chat'
  | 'system'
  | 'announcement'
  | 'moderation'
  | 'game_event'
  | 'private';

export interface MessageMetadata {
  readonly isEdited: boolean;
  editedAt?: Date;
  deletedAt?: Date;
  attachments?: Attachment[];
  mentions?: string[]; // User IDs
  links?: string[];
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed' | 'deleted';

export interface MessageReaction {
  emoji: string;
  count: number;
  users: Set<string>; // User IDs who reacted
}

export interface Attachment {
  type: 'image' | 'video' | 'file';
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

// Chat Room Types
export interface ChatRoom extends BaseEntity {
  name: string;
  type: ChatRoomType;
  participants: Set<string>;
  messages: Message[];
  metadata: ChatRoomMetadata;
  settings: ChatRoomSettings;
  status: ChatRoomStatus;
}

export type ChatRoomType = 'public' | 'private' | 'game' | 'moderation' | 'support';

export interface ChatRoomMetadata {
  description?: string;
  iconUrl?: string;
  tags?: string[];
  gameId?: string; // For game-specific chat rooms
  readonly participantCount: number;
  readonly messageCount: number;
}

export interface ChatRoomSettings {
  maxParticipants: number;
  messageRateLimit: number; // milliseconds
  allowReplies: boolean;
  allowReactions: boolean;
  allowAttachments: boolean;
  allowLinks: boolean;
  moderation: ModerationSettings;
}

export interface ModerationSettings {
  enabled: boolean;
  autoModeration: boolean;
  blockedWords: Set<string>;
  moderators: Set<string>; // User IDs
  readonly isModerated: boolean;
}

export type ChatRoomStatus = 'active' | 'readonly' | 'archived' | 'moderated';

// Event System
export type ChatEventType =
  | 'message'
  | 'message_updated'
  | 'message_deleted'
  | 'reaction_added'
  | 'reaction_removed'
  | 'join'
  | 'leave'
  | 'typing'
  | 'moderation_action'
  | 'room_updated';

export interface ChatEvent<T = unknown> {
  type: ChatEventType;
  roomId: string;
  userId: string;
  payload: T;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// Typing Indicator
export interface TypingIndicator {
  userId: string;
  username: string;
  timestamp: Date;
}

// Error Handling
export class ChatError extends Error {
  constructor(
    message: string,
    public code: ChatErrorCode,
    public data?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ChatError';
  }
}

export type ChatErrorCode =
  | 'rate_limit_exceeded'
  | 'room_full'
  | 'message_too_long'
  | 'user_blocked'
  | 'room_readonly'
  | 'invalid_content'
  | 'attachment_too_large';

// Type Guards and Validators
export const isValidMessage = (message: unknown): message is Message => {
  // Implementação da validação
  return true;
};

export const isValidChatRoom = (room: unknown): room is ChatRoom => {
  // Implementação da validação
  return true;
};

// Utility Types
export type ChatPermission =
  | 'send_message'
  | 'delete_message'
  | 'edit_message'
  | 'manage_room'
  | 'moderate_users'
  | 'manage_settings';

export interface ChatPermissions {
  userId: string;
  roomId: string;
  permissions: Set<ChatPermission>;
}
