
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { config } from '../utils/config';
import { PermissionLevel } from '../types/auth';

interface UserData {
  id: string;
  username: string;
  passwordHash: string;
  permissions: PermissionLevel;
  twoFactorSecret?: string;
  lastLogin?: Date;
}

export class UserRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool(config.database);
  }

  async findByUsername(username: string): Promise<UserData | null> {
    const query = `
      SELECT id, username, password_hash, permissions, two_factor_secret, last_login
      FROM users
      WHERE username = $1
    `;

    const result = await this.pool.query(query, [username]);
    return result.rows[0] || null;
  }

  async updateLastLogin(userId: string): Promise<void> {
    const query = `
      UPDATE users
      SET last_login = NOW()
      WHERE id = $1
    `;

    await this.pool.query(query, [userId]);
  }

  async saveTwoFactorSecret(userId: string, secret: string): Promise<void> {
    const query = `
      UPDATE users
      SET two_factor_secret = $2
      WHERE id = $1
    `;

    await this.pool.query(query, [userId, secret]);
  }
}

// packages/maintainer/src/auth/RateLimiter.ts
import { RateLimitConfig } from '../types/auth';
import { redis } from '../utils/redis';

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async isRateLimited(key: string): Promise<boolean> {
    const now = Date.now();
    const windowKey = `ratelimit:${key}:${Math.floor(now / this.config.windowMs)}`;

    const count = await redis.incr(windowKey);
    if (count === 1) {
      await redis.expire(windowKey, Math.ceil(this.config.windowMs / 1000));
    }

    return count > this.config.maxRequests;
  }

  async blockKey(key: string): Promise<void> {
    const blockKey = `ratelimit:blocked:${key}`;
    await redis.setex(blockKey, Math.ceil(this.config.blockDuration / 1000), 'blocked');
  }

  async isBlocked(key: string): Promise<boolean> {
    const blockKey = `ratelimit:blocked:${key}`;
    return (await redis.exists(blockKey)) === 1;
  }
}

// packages/maintainer/src/auth/TwoFactorAuth.ts
import { authenticator } from 'otplib';
import { UserRepository } from './UserRepository';

export class TwoFactorAuth {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async setupTwoFactor(userId: string): Promise<string> {
    const secret = authenticator.generateSecret();
    await this.userRepo.saveTwoFactorSecret(userId, secret);
    return secret;
  }

  async validateToken(userId: string, token: string): Promise<boolean> {
    const user = await this.userRepo.findByUsername(userId);
    if (!user?.twoFactorSecret) return false;

    return authenticator.verify({
      token,
      secret: user.twoFactorSecret,
    });
  }
}

// packages/maintainer/src/auth/AuthService.ts (atualizado)
export class AuthService {
  private rateLimiter: RateLimiter;
  private twoFactorAuth: TwoFactorAuth;
  private userRepo: UserRepository;

  constructor() {
    this.rateLimiter = new RateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutos
      maxRequests: 5,
      blockDuration: 60 * 60 * 1000, // 1 hora
    });
    this.twoFactorAuth = new TwoFactorAuth();
    this.userRepo = new UserRepository();
  }

  async authenticate(
    request: AuthenticationRequest,
    context: SecurityContext
  ): Promise<AuthenticationResponse> {
    try {
      // Rate Limiting
      const isLimited = await this.rateLimiter.isRateLimited(context.ipAddress);
      if (isLimited) {
        await this.rateLimiter.blockKey(context.ipAddress);
        return {
          success: false,
          error: 'Too many attempts. Please try again later.',
        };
      }

      // Validação de credenciais
      const user = await this.userRepo.findByUsername(request.username);
      if (!user || !(await bcrypt.compare(request.password, user.passwordHash))) {
        return {
          success: false,
          error: 'Invalid credentials',
        };
      }

      // 2FA se habilitado
      if (user.twoFactorSecret && !request.twoFactorToken) {
        return {
          success: false,
          requiresTwoFactor: true,
          error: 'Two-factor authentication required',
        };
      }

      if (user.twoFactorSecret && request.twoFactorToken) {
        const isValid = await this.twoFactorAuth.validateToken(user.id, request.twoFactorToken);

        if (!isValid) {
          return {
            success: false,
            error: 'Invalid two-factor token',
          };
        }
      }

      // Atualizar último login
      await this.userRepo.updateLastLogin(user.id);

      // Gerar token
      const token = this.tokenManager.generateToken(user.id, user.permissions);

      return {
        success: true,
        token,
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
        permissions: user.permissions,
      };
    } catch (error) {
      logger.error('Authentication error:', error);
      return {
        success: false,
        error: 'Authentication failed',
      };
    }
  }
}

// packages/maintainer/src/auth/__tests__/AuthService.test.ts
import { AuthService } from '../AuthService';
import { SecurityContext, AuthenticationRequest } from '../../types/auth';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  test('should authenticate valid credentials', async () => {
    const request: AuthenticationRequest = {
      username: 'testuser',
      password: 'password123',
    };

    const context: SecurityContext = {
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent',
      timestamp: new Date(),
      resource: '/auth',
      action: 'LOGIN',
    };

    const result = await authService.authenticate(request, context);
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
  });

  test('should handle rate limiting', async () => {
    const request: AuthenticationRequest = {
      username: 'testuser',
      password: 'wrong-password',
    };

    const context: SecurityContext = {
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent',
      timestamp: new Date(),
      resource: '/auth',
      action: 'LOGIN',
    };

    // Tentar várias vezes para atingir o limite
    for (let i = 0; i < 6; i++) {
      await authService.authenticate(request, context);
    }

    const result = await authService.authenticate(request, context);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Too many attempts');
  });
});
