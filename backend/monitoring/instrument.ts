import * as Sentry from "@sentry/node";
import { secret } from "encore.dev/config";

const sentryDSN = secret("SentryDSN");

Sentry.init({
  dsn: sentryDSN(),
  // Tracing
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});