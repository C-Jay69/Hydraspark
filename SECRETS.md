# Required Secrets Configuration

This application requires the following secrets to be configured in Encore's secret manager.

## Production Secrets (Required)

### JWTSecret
- **Purpose**: Used to sign and verify JWT authentication tokens
- **Type**: String
- **Required**: Yes (has development fallback)
- **How to set**:
  ```bash
  encore secret set --type prod JWTSecret
  ```
- **Value**: Generate a strong random string (minimum 32 characters)
  ```bash
  openssl rand -base64 32
  ```

## Optional Secrets

### SentryDSN
- **Purpose**: Enables error tracking and monitoring with Sentry
- **Type**: String
- **Required**: No (application works without it)
- **How to set**:
  ```bash
  encore secret set --type prod SentryDSN
  ```
- **Value**: Your Sentry DSN from https://sentry.io/
  - Format: `https://[key]@[org].ingest.sentry.io/[project]`

## Development Setup

For local development, the application will use fallback values:

- **JWTSecret**: Falls back to `JWT_SECRET` environment variable or a default development secret
- **SentryDSN**: Monitoring is disabled if not configured

### Setting Development Secrets

```bash
# Set JWT secret for development
encore secret set --type dev JWTSecret

# Set Sentry DSN for development (optional)
encore secret set --type dev SentryDSN
```

## Environment Variables (Alternative for Local Development)

You can also set these as environment variables for local development:

```bash
export JWT_SECRET="your-development-secret-here"
```

⚠️ **Important**: The development fallback for JWTSecret should NEVER be used in production. Always configure proper secrets before deploying.
