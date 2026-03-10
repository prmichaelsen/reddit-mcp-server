#!/usr/bin/env tsx

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.PLATFORM_SERVICE_TOKEN || 'test-secret';
const userId = process.argv[2] || 'test-user-123';

const token = jwt.sign(
  {
    userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  },
  JWT_SECRET,
  {
    issuer: 'agentbase.me',
    audience: 'mcp-server',
  }
);

console.log('Generated JWT token:');
console.log(token);
console.log('\nDecoded:');
console.log(jwt.decode(token));

try {
  const verified = jwt.verify(token, JWT_SECRET, {
    issuer: 'agentbase.me',
    audience: 'mcp-server',
  });
  console.log('\nToken verified successfully');
  console.log(verified);
} catch (error) {
  console.error('\nToken verification failed:', error);
}
