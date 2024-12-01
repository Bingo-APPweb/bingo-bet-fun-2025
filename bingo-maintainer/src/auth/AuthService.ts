import bcrypt from 'bcrypt';
import {
  AuthenticationRequest,
  AuthenticationResponse,
  SecurityContext,
  SecuritySeverity,
} from '../types/auth';
import { TokenManager } from './TokenManager';
import { SecurityValidator } from './SecurityValidator';
import { logger } from '../utils/logger';
import jwt from 'jsonwebtoken';
import config from 'config';
import { AuthConfig } from '@/types';

export class AuthService {
  private static instance: AuthService;
  private tokenManager: TokenManager;
  private securityValidator: SecurityValidator;
  private config: AuthConfig;

  constructor() {
    this.tokenManager = new TokenManager();
    this.securityValidator = new SecurityValidator();
    this.config = config.get('maintainer.auth');
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }
  
  async generateToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, this.config.jwtSecret, {
      expiresIn: this.config.tokenExpiration
    });
  }

  async verifyToken(token: string): Promise<any> {
    return jwt.verify(token, this.config.jwtSecret);
  }
}
  async authenticate(
    request: AuthenticationRequest,
    context: SecurityContext
  ): Promise<AuthenticationResponse> {
    try {
      // Validação de segurança do contexto
      const securityEvents = await this.securityValidator.validateContext(context);
      const hasCriticalEvents = securityEvents.some(
        (event) => event.severity === SecuritySeverity.CRITICAL
      );

      if (hasCriticalEvents) {
        return {
          success: false,
          error: 'Authentication blocked due to security concerns',
        };
      }

      // Autenticação
      const user = await this.validateCredentials(request);
      if (!user) {
        return {
          success: false,
          error: 'Invalid credentials',
        };
      }

      // Geração do token
      const token = this.tokenManager.generateToken(user.id, user.permissions);
      const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 horas

      // Log do evento de autenticação
      logger.info('Authentication successful', {
        userId: user.id,
        context,
      });

      return {
        success: true,
        token,
        expiresAt,
        permissions: user.permissions,
      };
    } catch (error) {
      logger.error('Authentication error', error);

      return {
        success: false,
        error: 'Authentication failed',
      };
    }
  }

  private async validateCredentials(request: AuthenticationRequest): Promise<any> {
    // TODO: Implementar validação real com banco de dados
    const mockUser = {
      id: '1',
      username: 'admin',
      passwordHash: await bcrypt.hash('admin123', 10),
      permissions: PermissionLevel.ADMIN,
    };

    if (
      request.username === mockUser.username &&
      (await bcrypt.compare(request.password, mockUser.passwordHash))
    ) {
      return mockUser;
    }

    return null;
  }
}
