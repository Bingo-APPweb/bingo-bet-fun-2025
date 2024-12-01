// bingo-maintainer/src/auth/__tests__/AuthService.test.ts
import { AuthService } from '../AuthService';
import config from 'config';

jest.mock('config', () => ({
  get: jest.fn().mockReturnValue({
    jwtSecret: 'test-secret',
    tokenExpiration: '1h',
  }),
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  it('should generate a valid token', async () => {
    const userId = 'test-user';
    const token = await authService.generateToken(userId);

    expect(typeof token).toBe('string');
    expect(token).toBeTruthy();
  });

  it('should verify a valid token', async () => {
    const userId = 'test-user';
    const token = await authService.generateToken(userId);
    const decoded = await authService.verifyToken(token);

    expect(decoded).toHaveProperty('userId', userId);
  });

  it('should reject an invalid token', async () => {
    const invalidToken = 'invalid-token';

    await expect(authService.verifyToken(invalidToken)).rejects.toThrow();
  });
});
