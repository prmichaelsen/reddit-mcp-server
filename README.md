# reddit-mcp-server

MCP server wrapping the Reddit API for AI agents, mcp-auth enabled

> Built with [Agent Context Protocol](https://github.com/prmichaelsen/agent-context-protocol)

## Quick Start

[Add installation and usage instructions here]

## Features

- Multi-tenant Reddit API access via mcp-auth
- JWT authentication with per-user token resolution
- Cloud Run deployment via `npm run deploy`

## Development

This project uses the Agent Context Protocol for development:

- `@acp.init` - Initialize agent context
- `@acp.plan` - Plan milestones and tasks
- `@acp.proceed` - Continue with next task
- `@acp.status` - Check project status

See [AGENT.md](./AGENT.md) for complete ACP documentation.

## Project Structure

```
reddit-mcp-server/
├── AGENT.md              # ACP methodology
├── agent/                # ACP directory
│   ├── design/          # Design documents
│   ├── milestones/      # Project milestones
│   ├── tasks/           # Task breakdown
│   ├── patterns/        # Architectural patterns
│   └── progress.yaml    # Progress tracking
├── src/                 # Source code
│   ├── index.ts         # Server entry point
│   ├── auth/            # JWT auth provider & token resolver
│   └── config/          # Environment configuration
└── Dockerfile.production # Production Docker build
```

## Getting Started

1. Initialize context: `@acp.init`
2. Plan your project: `@acp.plan`
3. Start building: `@acp.proceed`

## License

MIT
