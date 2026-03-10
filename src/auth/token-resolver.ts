import type { ResourceTokenResolver } from '@prmichaelsen/mcp-auth';
import type { JWTAuthProvider } from './provider.js';
import { env } from '../config/environment.js';

interface CachedToken {
  token: string;
  expiresAt: number;
}

export class PlatformTokenResolver implements ResourceTokenResolver {
  private authProvider: JWTAuthProvider;
  private tokenCache = new Map<string, CachedToken>();
  private cacheTtl = 5 * 60 * 1000; // 5 minutes

  constructor(authProvider: JWTAuthProvider) {
    this.authProvider = authProvider;
  }

  async initialize(): Promise<void> {
    console.log('Platform token resolver initialized');
    console.log(`  Platform URL: ${env.PLATFORM_URL}`);
  }

  async resolveToken(userId: string, resourceType: string): Promise<string | null> {
    try {
      const cacheKey = `${userId}:${resourceType}`;

      // Check cache
      const cached = this.tokenCache.get(cacheKey);
      if (cached && Date.now() < cached.expiresAt) {
        return cached.token;
      }

      // Get JWT for platform authentication
      const jwtToken = this.authProvider.getJWTToken(userId);
      if (!jwtToken) {
        console.warn(`No JWT token found for user ${userId}`);
        return null;
      }

      // Fetch credentials from platform
      const url = `${env.PLATFORM_URL}/api/credentials/${resourceType}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'X-User-ID': userId,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        console.warn(`No ${resourceType} credentials configured for user ${userId}`);
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Platform API error: ${(errorData as Record<string, string>).error || response.statusText}`
        );
      }

      const data = (await response.json()) as { access_token?: string };
      const token = data.access_token;

      if (!token) {
        console.warn(`No access_token in response for ${userId}:${resourceType}`);
        return null;
      }

      // Cache token
      this.tokenCache.set(cacheKey, {
        token,
        expiresAt: Date.now() + this.cacheTtl,
      });

      return token;
    } catch (error) {
      console.error(`Failed to resolve token for ${userId}:${resourceType}:`, error);
      return null;
    }
  }

  async cleanup(): Promise<void> {
    this.tokenCache.clear();
    console.log('Token resolver cleaned up');
  }
}
