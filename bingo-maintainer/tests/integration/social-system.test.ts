import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ChatService } from '../src/services/chat';
import { UserInteractionMonitor } from '../src/services/monitoring';
import { CommunityValidator } from '../src/services/community';
import { WebSocket } from 'ws';

describe('Social System Integrity Tests', () => {
  let chatService: ChatService;
  let interactionMonitor: UserInteractionMonitor;
  let communityValidator: CommunityValidator;

  beforeEach(() => {
    chatService = new ChatService();
    interactionMonitor = new UserInteractionMonitor();
    communityValidator = new CommunityValidator();
  });

  describe('Chat Real-time Validation', () => {
    it('should handle high message volume without performance degradation', async () => {
      const numberOfMessages = 1000;
      const maxLatency = 100; // ms
      const messagePromises = [];

      for (let i = 0; i < numberOfMessages; i++) {
        messagePromises.push(
          chatService.processMessage({
            userId: `user${i}`,
            content: `Test message ${i}`,
            timestamp: Date.now(),
          })
        );
      }

      const startTime = Date.now();
      await Promise.all(messagePromises);
      const endTime = Date.now();

      const processingTime = endTime - startTime;
      const averageLatency = processingTime / numberOfMessages;

      expect(averageLatency).toBeLessThan(maxLatency);
    });

    it('should properly filter inappropriate content', async () => {
      const testMessages = [
        { content: 'Hello world', shouldPass: true },
        { content: '@#$% bad word', shouldPass: false },
        { content: 'Normal message with link: http://test.com', shouldPass: true },
      ];

      for (const msg of testMessages) {
        const result = await chatService.validateMessage(msg.content);
        expect(result.isValid).toBe(msg.shouldPass);
      }
    });
  });

  describe('Community Interaction Monitoring', () => {
    it('should detect spam patterns', async () => {
      const spamMessages = Array(10).fill({
        userId: 'spammer123',
        content: 'Same message',
        timestamp: Date.now(),
      });

      for (const msg of spamMessages) {
        await interactionMonitor.trackMessage(msg);
      }

      const userStatus = await interactionMonitor.getUserStatus('spammer123');
      expect(userStatus.spamScore).toBeGreaterThan(0.7);
    });

    it('should track user interaction patterns', async () => {
      const interactions = [
        { type: 'message', userId: 'user1' },
        { type: 'reaction', userId: 'user1' },
        { type: 'game_participation', userId: 'user1' },
      ];

      for (const interaction of interactions) {
        await interactionMonitor.trackInteraction(interaction);
      }

      const userMetrics = await interactionMonitor.getUserMetrics('user1');
      expect(userMetrics.totalInteractions).toBe(3);
      expect(userMetrics.interactionTypes.size).toBe(3);
    });
  });

  describe('Concurrent Users Management', () => {
    it('should handle multiple simultaneous connections', async () => {
      const numberOfUsers = 1000;
      const connections = [];

      for (let i = 0; i < numberOfUsers; i++) {
        connections.push(
          communityValidator.simulateConnection({
            userId: `user${i}`,
            roomId: 'testRoom',
          })
        );
      }

      const results = await Promise.all(connections);
      const successfulConnections = results.filter((r) => r.connected);
      expect(successfulConnections.length).toBe(numberOfUsers);
    });

    it('should maintain consistent state across multiple instances', async () => {
      const room = 'testRoom';
      const instances = Array(3)
        .fill(null)
        .map(() => new CommunityValidator());

      // Simulate user actions across different instances
      await instances[0].addUser({ userId: 'user1', roomId: room });
      await instances[1].addUser({ userId: 'user2', roomId: room });
      await instances[2].removeUser({ userId: 'user1', roomId: room });

      // Check consistency across all instances
      const states = await Promise.all(instances.map((instance) => instance.getRoomState(room)));

      states.forEach((state) => {
        expect(state.users.size).toBe(1);
        expect(state.users.has('user2')).toBe(true);
      });
    });
  });
});
