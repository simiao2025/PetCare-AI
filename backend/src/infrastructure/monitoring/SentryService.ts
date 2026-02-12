export class SentryService {
  private dsn: string;

  constructor() {
    this.dsn = process.env.SENTRY_DSN || '';
    if (!this.dsn) {
      console.warn('Sentry DSN not found. Running in mock mode.');
    }
  }

  captureException(error: any, context?: any) {
    if (!this.dsn) {
      console.error('[Sentry Mock] Captured Exception:', error);
      if (context) {
        console.error('[Sentry Mock] Context:', context);
      }
      return;
    }

    // Real Sentry implementation would go here
    // Sentry.captureException(error, { extra: context });
    console.log('[Sentry] Sending error to Sentry...');
  }

  captureMessage(message: string) {
    if (!this.dsn) {
      console.log('[Sentry Mock] Captured Message:', message);
      return;
    }
    console.log('[Sentry] Sending message to Sentry...');
  }
}
