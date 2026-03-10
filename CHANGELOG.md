# Changelog

## [1.0.0] - 2026-03-10

### Added
- Project scaffold with mcp-auth server wrapping pattern
- JWT auth provider using PLATFORM_SERVICE_TOKEN as shared secret
- Per-user token resolver for Reddit credentials via agentbase.me
- SSE transport on port 8080 with CORS, rate limiting, and logging
- Docker multi-stage production build
- Cloud Build / Cloud Run deployment config
- esbuild build and watch scripts
- Jest test configuration
- Utility scripts for secret upload and auth testing
- Integration with @prmichaelsen/reddit-mcp factory for Reddit API tools
