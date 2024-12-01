// packages/maintainer/tests/unit/types/security.test.ts
import { SecuritySeverity, SecurityEventType, PermissionLevel } from '../../../src/types/security';
import type { SecurityEvent, SecurityRule, SecurityContext } from '../../../src/types/security';

describe('Security Types and Interfaces', () => {
  describe('Enums', () => {
    test('SecuritySeverity contains required levels', () => {
      expect(Object.keys(SecuritySeverity)).toEqual(
        expect.arrayContaining(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
      );
    });

    test('SecurityEventType has all necessary types', () => {
      expect(Object.keys(SecurityEventType)).toEqual(
        expect.arrayContaining([
          'AUTH_SUCCESS',
          'AUTH_FAILURE',
          'TOKEN_ISSUED',
          'TOKEN_REVOKED',
          'PERMISSION_DENIED',
        ])
      );
    });

    test('PermissionLevel defines correct hierarchy', () => {
      expect(PermissionLevel.ADMIN).toBeGreaterThan(PermissionLevel.MAINTAINER);
      expect(PermissionLevel.MAINTAINER).toBeGreaterThan(PermissionLevel.AUDITOR);
    });
  });

  describe('Interface Validations', () => {
    test('creates valid SecurityEvent', () => {
      const event: SecurityEvent = {
        type: SecurityEventType.AUTH_SUCCESS,
        timestamp: new Date(),
        severity: SecuritySeverity.LOW,
        context: {
          userId: '123',
          action: 'login',
          resource: '/api/auth',
        },
      };
      expect(event).toBeTruthy();
    });

    test('creates valid SecurityRule', () => {
      const rule: SecurityRule = {
        id: 'auth-001',
        conditions: [
          {
            type: 'permission',
            value: PermissionLevel.ADMIN,
          },
        ],
        actions: ['allow', 'audit'],
        resource: '/api/*',
      };
      expect(rule).toBeTruthy();
    });
  });
});

// packages/maintainer/tests/unit/auth/AuthService.test.ts
import { AuthService } from '../../../src/auth/AuthService';
import { TokenManager } from '../../../src/auth/TokenManager';
import { SecurityValidator } from '../../../src/auth/SecurityValidator';

describe('AuthService', () => {
  let authService: AuthService;
  let tokenManager: TokenManager;
  let securityValidator: SecurityValidator;

  beforeEach(() => {
    tokenManager = new TokenManager();
    securityValidator = new SecurityValidator();
    authService = new AuthService(tokenManager, securityValidator);
  });

  describe('Authentication', () => {
    test('authenticates valid credentials', async () => {
      const result = await authService.authenticate({
        username: 'admin',
        password: 'correct-password',
      });

      expect(result.success).toBeTruthy();
      expect(result.token).toBeTruthy();
    });

    test('rejects invalid credentials', async () => {
      await expect(
        authService.authenticate({
          username: 'admin',
          password: 'wrong-password',
        })
      ).rejects.toThrow();
    });

    test('implements rate limiting', async () => {
      const attempts = Array(5)
        .fill(null)
        .map(() =>
          authService
            .authenticate({
              username: 'admin',
              password: 'wrong-password',
            })
            .catch((e) => e)
        );

      const results = await Promise.all(attempts);
      expect(results.some((r) => r.message.includes('rate limit'))).toBeTruthy();
    });
  });

  describe('Session Management', () => {
    test('creates session on successful auth', async () => {
      const { token } = await authService.authenticate({
        username: 'admin',
        password: 'correct-password',
      });

      const session = await authService.getSession(token);
      expect(session).toBeTruthy();
      expect(session.userId).toBeTruthy();
    });

    test('invalidates session on logout', async () => {
      const { token } = await authService.authenticate({
        username: 'admin',
        password: 'correct-password',
      });

      await authService.logout(token);
      await expect(authService.getSession(token)).rejects.toThrow();
    });
  });
});

// packages/maintainer/tests/unit/auth/TokenManager.test.ts
import { TokenManager } from '../../../src/auth/TokenManager';
import { JWTPayload } from '../../../src/types/auth';

describe('TokenManager', () => {
  let tokenManager: TokenManager;

  beforeEach(() => {
    tokenManager = new TokenManager();
  });

  describe('Token Generation', () => {
    test('generates valid JWT token', () => {
      const payload: JWTPayload = {
        userId: '123',
        permissions: ['admin'],
        exp: Date.now() + 3600000,
      };

      const token = tokenManager.generateToken(payload);
      expect(token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
    });

    test('includes correct claims in token', () => {
      const payload: JWTPayload = {
        userId: '123',
        permissions: ['admin'],
        exp: Date.now() + 3600000,
      };

      const token = tokenManager.generateToken(payload);
      const decoded = tokenManager.verifyToken(token);

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.permissions).toEqual(payload.permissions);
    });
  });

  describe('Token Validation', () => {
    test('validates unexpired tokens', () => {
      const token = tokenManager.generateToken({
        userId: '123',
        exp: Date.now() + 3600000,
      });

      expect(() => tokenManager.verifyToken(token)).not.toThrow();
    });

    test('rejects expired tokens', () => {
      const token = tokenManager.generateToken({
        userId: '123',
        exp: Date.now() - 1000,
      });

      expect(() => tokenManager.verifyToken(token)).toThrow(/expired/i);
    });

    test('rejects tampered tokens', () => {
      const token = tokenManager.generateToken({
        userId: '123',
        exp: Date.now() + 3600000,
      });

      const tamperedToken = token.slice(0, -5) + 'xxxxx';
      expect(() => tokenManager.verifyToken(tamperedToken)).toThrow();
    });
  });
});

// packages/maintainer/tests/unit/auth/SecurityValidator.test.ts
import { SecurityValidator } from '../../../src/auth/SecurityValidator';
import { SecurityContext, SecurityRule } from '../../../src/types/security';

describe('SecurityValidator', () => {
  let validator: SecurityValidator;

  beforeEach(() => {
    validator = new SecurityValidator();
  });

  describe('Rule Validation', () => {
    test('validates against simple rules', async () => {
      const context: SecurityContext = {
        userId: '123',
        action: 'read',
        resource: '/api/games',
        permissions: ['user'],
      };

      const rule: SecurityRule = {
        id: 'read-access',
        conditions: [
          {
            type: 'permission',
            value: 'user',
          },
        ],
        actions: ['allow'],
        resource: '/api/games',
      };

      const result = await validator.validate(context, [rule]);
      expect(result.allowed).toBeTruthy();
    });

    test('applies rule priority correctly', async () => {
      const context: SecurityContext = {
        userId: '123',
        action: 'write',
        resource: '/api/games',
        permissions: ['user'],
      };

      const rules: SecurityRule[] = [
        {
          id: 'deny-all',
          priority: 1,
          conditions: [],
          actions: ['deny'],
          resource: '*',
        },
        {
          id: 'allow-write',
          priority: 2,
          conditions: [
            {
              type: 'permission',
              value: 'user',
            },
          ],
          actions: ['allow'],
          resource: '/api/games',
        },
      ];

      const result = await validator.validate(context, rules);
      expect(result.allowed).toBeFalsy();
    });
  });

  describe('Security Events', () => {
    test('generates audit events for validations', async () => {
      const eventSpy = jest.fn();
      validator.on('security-event', eventSpy);

      await validator.validate(
        {
          userId: '123',
          action: 'read',
          resource: '/api/games',
        },
        []
      );

      expect(eventSpy).toHaveBeenCalled();
      expect(eventSpy.mock.calls[0][0]).toMatchObject({
        type: expect.any(String),
        timestamp: expect.any(Date),
      });
    });
  });
});
