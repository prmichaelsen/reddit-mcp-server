import type { AuthProvider, AuthResult, RequestContext } from '@prmichaelsen/mcp-auth';
import jwt from 'jsonwebtoken';
import { env } from '../config/environment.js';

interface CachedAuthResult {
  result: AuthResult;
  expiresAt: number;
}

export class JWTAuthProvider implements AuthProvider {
  private authCache = new Map<string, CachedAuthResult>();
  private jwtTokenCache = new Map<string, string>();
  private cacheTtl = 60000; // 60 seconds

  async initialize(): Promise<void> {
    console.log('JWT auth provider initialized');
    console.log(`  Issuer: ${env.JWT_ISSUER}`);
    console.log(`  Audience: ${env.JWT_AUDIENCE}`);
  }

  async authenticate(context: RequestContext): Promise<AuthResult> {
    try {
      const authHeader = context.headers?.['authorization'];

      if (!authHeader || Array.isArray(authHeader)) {
        return {
          authenticated: false,
          error: 'No authorization header provided',
        };
      }

      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return {
          authenticated: false,
          error: 'Invalid authorization format. Expected: Bearer <token>',
        };
      }

      const token = parts[1];

      // Check cache
      const cached = this.authCache.get(token);
      if (cached && Date.now() < cached.expiresAt) {
        return cached.result;
      }

      // Verify JWT using PLATFORM_SERVICE_TOKEN as shared secret
      const decoded = jwt.verify(token, env.PLATFORM_SERVICE_TOKEN, {
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
        algorithms: ['HS256'],
      }) as jwt.JwtPayload & {
        userId: string;
        email?: string;
        [key: string]: unknown;
      };

      if (!decoded.userId) {
        return {
          authenticated: false,
          error: 'JWT missing required userId claim',
        };
      }

      // Store JWT for forwarding to platform APIs
      this.jwtTokenCache.set(decoded.userId, token);

      const result: AuthResult = {
        authenticated: true,
        userId: decoded.userId,
        metadata: {
          email: decoded.email,
        },
      };

      // Cache result
      this.authCache.set(token, {
        result,
        expiresAt: Date.now() + this.cacheTtl,
      });

      return result;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return {
          authenticated: false,
          error: 'JWT token has expired',
        };
      }

      if (error instanceof jwt.JsonWebTokenError) {
        return {
          authenticated: false,
          error: `JWT verification failed: ${error.message}`,
        };
      }

      return {
        authenticated: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    }
  }

  getJWTToken(userId: string): string | undefined {
    return this.jwtTokenCache.get(userId);
  }

  async cleanup(): Promise<void> {
    this.authCache.clear();
    this.jwtTokenCache.clear();
    console.log('JWT auth provider cleaned up');
  }
}
