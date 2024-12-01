/**
 * File: /tests/unit/chat/message-validation.test.ts
 * Project: packages/maintainer
 * Path Tree:
 * packages/maintainer/
 *   └── tests/
 *       └── unit/
 *           └── chat/
 *               └── message-validation.test.ts
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { MessageValidator } from '../../../src/services/validators';
import { ChatMessage, MessageType, ValidationResult } from '../../../src/types/chat';

describe('Chat Message Validation', () => {
  let validator: MessageValidator;

  beforeEach(() => {
    validator = new MessageValidator({
      maxMessageLength: 500,
      maxEmojis: 5,
      rateLimitPerSecond: 3,
      restrictedWords: ['banned', 'spam'],
    });
  });

  describe('Basic Message Validation', () => {
    it('should validate a valid message', async () => {
      const message: ChatMessage = {
        id: 'msg_123',
        content: 'Hello World!',
        userId: 'user_123',
        roomId: 'room_123',
        timestamp: Date.now(),
        type: MessageType.REGULAR,
      };

      const result: ValidationResult = await validator.validateMessage(message);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty messages', async () => {
      const message: ChatMessage = {
        id: 'msg_124',
        content: '',
        userId: 'user_123',
        roomId: 'room_123',
        timestamp: Date.now(),
        type: MessageType.REGULAR,
      };

      const result = await validator.validateMessage(message);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Message content cannot be empty');
    });

    it('should reject messages exceeding length limit', async () => {
      const message: ChatMessage = {
        id: 'msg_125',
        content: 'a'.repeat(501),
        userId: 'user_123',
        roomId: 'room_123',
        timestamp: Date.now(),
        type: MessageType.REGULAR,
      };

      const result = await validator.validateMessage(message);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Message exceeds maximum length of 500 characters');
    });
  });

  describe('Content Safety', () => {
    it('should detect restricted words', async () => {
      const message: ChatMessage = {
        id: 'msg_126',
        content: 'This message contains spam content',
        userId: 'user_123',
        roomId: 'room_123',
        timestamp: Date.now(),
        type: MessageType.REGULAR,
      };

      const result = await validator.validateMessage(message);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Message contains restricted words');
    });

    it('should validate emoji count', async () => {
      const message: ChatMessage = {
        id: 'msg_127',
        content: '😀 😃 😄 😁 😅 😂', // 6 emojis
        userId: 'user_123',
        roomId: 'room_123',
        timestamp: Date.now(),
        type: MessageType.REGULAR,
      };

      const result = await validator.validateMessage(message);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Message exceeds maximum number of emojis');
    });
  });

  describe('Rate Limiting', () => {
    it('should track message frequency per user', async () => {
      const userId = 'user_123';
      const messages = Array(4)
        .fill(null)
        .map((_, index) => ({
          id: `msg_${128 + index}`,
          content: `Test message ${index}`,
          userId,
          roomId: 'room_123',
          timestamp: Date.now(),
          type: MessageType.REGULAR,
        }));

      const results = await Promise.all(messages.map((msg) => validator.validateMessage(msg)));

      // Should allow first 3 messages (rate limit) and reject the 4th
      expect(results.slice(0, 3).every((r) => r.isValid)).toBe(true);
      expect(results[3].isValid).toBe(false);
      expect(results[3].errors).toContain('Rate limit exceeded');
    });
  });

  describe('Special Message Types', () => {
    it('should handle system messages differently', async () => {
      const message: ChatMessage = {
        id: 'msg_132',
        content: 'System maintenance notification',
        userId: 'system',
        roomId: 'room_123',
        timestamp: Date.now(),
        type: MessageType.SYSTEM,
      };

      const result = await validator.validateMessage(message);
      expect(result.isValid).toBe(true);
      // System messages should bypass certain validations
      expect(result.bypass).toContain('rate-limit');
    });

    it('should validate command messages', async () => {
      const message: ChatMessage = {
        id: 'msg_133',
        content: '/help',
        userId: 'user_123',
        roomId: 'room_123',
        timestamp: Date.now(),
        type: MessageType.COMMAND,
      };

      const result = await validator.validateMessage(message);
      expect(result.isValid).toBe(true);
      expect(result.messageType).toBe(MessageType.COMMAND);
    });
  });
});
