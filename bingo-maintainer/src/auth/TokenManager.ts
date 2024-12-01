
import jwt from 'jsonwebtoken';
import { PermissionLevel, AuthenticationResponse } from '../types/auth';
import { config } from '../utils/config';

export class TokenManager {
  private readonly secret: string;
  private readonly tokenExpiration: string;

  constructor() {
    this.secret = config.auth.jwtSecret;
    this.tokenExpiration = config.auth.tokenExpiration || '8h';
  }

  generateToken(userId: string, permissions: PermissionLevel): string {
    return jwt.sign({ userId, permissions }, this.secret, { expiresIn: this.tokenExpiration });
  }

  verifyToken(token: string): jwt.JwtPayload | null {
    try {
      return jwt.verify(token, this.secret) as jwt.JwtPayload;
    } catch (error) {
      return null;
    }
  }
}
