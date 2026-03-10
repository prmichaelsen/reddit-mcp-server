# reddit-mcp-server

MCP server wrapping the Reddit API for AI agents, mcp-auth enabled.

This MCP server uses [@prmichaelsen/mcp-auth](https://github.com/prmichaelsen/mcp-auth) for authentication and multi-tenancy.

## Server Configuration

- **Type**: Dynamic (Per-User Credentials)
- **Auth Provider**: JWT
- **Platform**: agentbase.me

## Installation

```bash
npm install
```

## Development

```bash
# Copy environment config
cp .env.example .env
# Edit .env with your values

# Run in development mode with auto-reload
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Type check
npm run type-check
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `PLATFORM_URL`: Platform URL (default: https://agentbase.me)
- `PLATFORM_SERVICE_TOKEN`: Shared secret for JWT verification and platform auth
- `CORS_ORIGIN`: CORS origin (default: https://agentbase.me)

## Deployment

### Docker

```bash
docker build -f Dockerfile.production -t reddit-mcp-server .
docker run -p 8080:8080 --env-file .env reddit-mcp-server
```

### Google Cloud Run

```bash
# Upload secrets
tsx scripts/upload-secrets.ts

# Deploy via Cloud Build
gcloud builds submit --config cloudbuild.yaml
```

## Project Structure

```
reddit-mcp-server/
├── src/
│   ├── index.ts              # Main entry point with wrapServer
│   ├── auth/
│   │   ├── provider.ts       # JWT auth provider
│   │   └── token-resolver.ts # Per-user Reddit credential fetching
│   ├── config/
│   │   └── environment.ts    # Environment configuration
│   └── types/
│       └── index.ts          # Type definitions
├── scripts/
│   ├── upload-secrets.ts     # Upload secrets to GCP
│   └── test-auth.ts          # Test JWT generation/validation
├── package.json
├── tsconfig.json
├── jest.config.js
├── esbuild.build.js
├── esbuild.watch.js
├── Dockerfile.production
├── Dockerfile.development
├── cloudbuild.yaml
├── .env.example
└── README.md
```

## ACP Development

This project uses the Agent Context Protocol:

- `@acp.init` - Initialize agent context
- `@acp.plan` - Plan milestones and tasks
- `@acp.proceed` - Continue with next task
- `@acp.status` - Check project status

See [AGENT.md](./AGENT.md) for complete ACP documentation.

## License

MIT
