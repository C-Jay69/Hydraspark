import * as Sentry from "@sentry/node";
import { secret } from "encore.dev/config";

const sentryDSN = secret("SentryDSN");

function getSentryDSN(): string | undefined {
  try {
    return sentryDSN();
  } catch (error) {
    console.warn("SentryDSN not configured. Sentry monitoring will be disabled.");
    return undefined;
  }
}

const dsn = getSentryDSN();

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    sendDefaultPii: true,
  });
} else {
  console.log("Sentry monitoring is disabled. Configure SentryDSN secret to enable.");
}