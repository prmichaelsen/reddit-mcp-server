#!/usr/bin/env node

import { wrapServer } from '@prmichaelsen/mcp-auth';
import { createServer } from '@prmichaelsen/reddit-mcp/factory';
import { JWTAuthProvider } from './auth/provider.js';
import { PlatformTokenResolver } from './auth/token-resolver.js';
import { env, validateConfig } from './config/environment.js';

// Validate configuration
validateConfig();

// Create auth provider
const authProvider = new JWTAuthProvider();

// Create token resolver (per-user Reddit credentials)
const tokenResolver = new PlatformTokenResolver(authProvider);

// Wrap server with authentication
const wrappedServer = wrapServer({
  serverFactory: (accessToken: string) => {
    return createServer(accessToken).server;
  },
  authProvider,
  tokenResolver,
  resourceType: 'reddit',
  transport: {
    type: 'sse',
    port: parseInt(env.PORT, 10),
    host: '0.0.0.0',
    basePath: '/mcp',
    cors: true,
    corsOrigin: env.CORS_ORIGIN,
  },
  middleware: {
    rateLimit: {
      enabled: true,
      maxRequests: 100,
      windowMs: 60 * 60 * 1000, // 1 hour
    },
    logging: {
      enabled: true,
      level: 'info',
    },
  },
});

// Start server
async function main() {
  try {
    await wrappedServer.start();
    console.log('reddit-mcp-server started successfully');
    console.log(`Listening on port ${env.PORT}`);
    console.log(`Endpoint: http://0.0.0.0:${env.PORT}/mcp`);
    console.log(`Health check: http://0.0.0.0:${env.PORT}/mcp/health`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await wrappedServer.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await wrappedServer.stop();
  process.exit(0);
});

main();
