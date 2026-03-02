import type { MaxAccountConfig, MaxUpdate, MessageEnvelope } from './types.js';
import { normalizeMessage, normalizeBotStarted, normalizeCallback } from './normalizer.js';

export interface AdapterLogger {
  info?: (...args: unknown[]) => void;
  warn?: (...args: unknown[]) => void;
  error?: (...args: unknown[]) => void;
  debug?: (...args: unknown[]) => void;
}

export interface MaxAdapterOptions {
  config: MaxAccountConfig;
  onMessage: (envelope: MessageEnvelope) => void | Promise<void>;
  onReady?: () => void;
  onError?: (err: unknown) => void;
  logger?: AdapterLogger;
  signal?: AbortSignal;
}

const BACKOFF_STEPS = [1_000, 2_000, 5_000, 10_000, 30_000];

function formatError(err: unknown): string {
  if (err instanceof Error) return err.stack ?? err.message;
  if (typeof err === 'string') return err;
  try { return JSON.stringify(err); } catch { return String(err); }
}

function backoffDelay(attempt: number): number {
  return BACKOFF_STEPS[Math.min(attempt, BACKOFF_STEPS.length - 1)];
}

/**
 * Adapter that wraps @maxhub/max-bot-api Bot class.
 * Uses Long Polling with supervised auto-reconnect on transient errors.
 */
export class MaxAdapter {
  private bot: any = null;
  private api: any = null;
  private stopped = false;
  private BotClass: any = null;

  private lastPollOk: number | null = null;
  private reconnectAttempt = 0;

  private readonly token: string;
  private readonly mediaMaxMb: number;
  private readonly onMessage: MaxAdapterOptions['onMessage'];
  private readonly onReady: MaxAdapterOptions['onReady'];
  private readonly onError: MaxAdapterOptions['onError'];
  private readonly logger: NonNullable<MaxAdapterOptions['logger']>;

  constructor(private readonly opts: MaxAdapterOptions) {
    this.token = opts.config.botToken;
    this.mediaMaxMb = opts.config.mediaMaxMb ?? 5;
    this.onMessage = opts.onMessage;
    this.onReady = opts.onReady;
    this.onError = opts.onError;
    this.logger = opts.logger ?? {};

    if (opts.signal) {
      opts.signal.addEventListener('abort', () => this.stop(), { once: true });
    }
  }

  /**
   * Start Long Polling with supervised reconnect loop.
   */
  async start(): Promise<void> {
    if (this.stopped) return;

    const maxBotApi = await import('@maxhub/max-bot-api');
    this.BotClass = maxBotApi.Bot;

    await this.connectAndPoll();
  }

  /**
   * Create a fresh Bot instance, register handlers, verify connection, start polling.
   * On polling crash — automatically retries with backoff unless stopped.
   */
  private async connectAndPoll(): Promise<void> {
    while (!this.stopped) {
      try {
        this.bot = new this.BotClass(this.token);
        this.api = this.bot.api;

        this.registerHandlers();

        const info = await this.api.getMyInfo();
        this.logger.info?.(
          `[MAX] Connected as @${info.username ?? info.name ?? 'bot'}`,
        );
        this.lastPollOk = Date.now();

        if (this.reconnectAttempt > 0) {
          this.logger.info?.(
            `[MAX] Polling resumed after ${this.reconnectAttempt} reconnect attempt(s)`,
          );
        }
        this.reconnectAttempt = 0;
        this.onReady?.();

        this.logger.info?.('[MAX] Starting Long Polling...');
        await this.bot.start();

        // bot.start() resolved normally — means it was stopped cleanly
        if (!this.stopped) {
          this.logger.warn?.('[MAX] bot.start() exited unexpectedly, will reconnect');
        }
      } catch (err) {
        if (this.stopped) return;

        const delay = backoffDelay(this.reconnectAttempt);
        this.reconnectAttempt++;

        this.logger.error?.(
          `[MAX] Polling failed (attempt #${this.reconnectAttempt}, ` +
          `last ok: ${this.lastPollOk ? new Date(this.lastPollOk).toISOString() : 'never'}): ` +
          formatError(err),
        );
        this.logger.info?.(`[MAX] Reconnecting in ${delay / 1000}s...`);

        this.onError?.(err);
        this.cleanupBot();

        await this.sleep(delay);
      }
    }
  }

  private registerHandlers(): void {
    this.bot.on('bot_started', async (ctx: any) => {
      try {
        const update = ctx.update as MaxUpdate;
        const envelope = normalizeBotStarted(update);
        if (envelope) {
          this.lastPollOk = Date.now();
          await this.onMessage(envelope);
        }
      } catch (err) {
        this.logger.error?.(`[MAX] Error handling bot_started: ${formatError(err)}`);
        this.onError?.(err);
      }
    });

    this.bot.on('message_created', async (ctx: any) => {
      try {
        const update = ctx.update as MaxUpdate;
        const envelope = await normalizeMessage(update, this.mediaMaxMb);
        if (envelope) {
          this.lastPollOk = Date.now();
          await this.onMessage(envelope);
        }
      } catch (err) {
        this.logger.error?.(`[MAX] Error handling message_created: ${formatError(err)}`);
        this.onError?.(err);
      }
    });

    this.bot.on('message_edited', async (ctx: any) => {
      try {
        const update = ctx.update as MaxUpdate;
        const envelope = await normalizeMessage(update, this.mediaMaxMb);
        if (envelope) {
          envelope.metadata.edited = true;
          this.lastPollOk = Date.now();
          await this.onMessage(envelope);
        }
      } catch (err) {
        this.logger.error?.(`[MAX] Error handling message_edited: ${formatError(err)}`);
        this.onError?.(err);
      }
    });

    this.bot.on('message_callback', async (ctx: any) => {
      try {
        const update = ctx.update as MaxUpdate;
        const envelope = normalizeCallback(update);
        if (envelope) {
          this.lastPollOk = Date.now();
          await this.onMessage(envelope);
        }
      } catch (err) {
        this.logger.error?.(`[MAX] Error handling message_callback: ${formatError(err)}`);
        this.onError?.(err);
      }
    });

    this.bot.catch((err: unknown) => {
      this.logger.error?.(`[MAX] Bot catch handler: ${formatError(err)}`);
      this.onError?.(err);
    });
  }

  private cleanupBot(): void {
    try { this.bot?.stop?.(); } catch { /* ignore */ }
    this.bot = null;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      if (this.stopped) { resolve(); return; }
      const timer = setTimeout(resolve, ms);
      if (this.opts.signal) {
        const onAbort = () => { clearTimeout(timer); resolve(); };
        this.opts.signal.addEventListener('abort', onAbort, { once: true });
      }
    });
  }

  /**
   * Stop Long Polling and clean up. Only called on abort signal or explicit stop.
   */
  stop(): void {
    if (this.stopped) return;
    this.stopped = true;
    this.cleanupBot();
    this.logger.info?.('[MAX] Adapter stopped');
  }

  getApi(): any {
    return this.api;
  }

  async sendText(
    chatId: number,
    text: string,
    extra?: Record<string, unknown>,
  ): Promise<void> {
    if (!this.api) throw new Error('MAX adapter not started');
    await this.api.sendMessageToChat(chatId, text, extra);
  }

  async sendReply(
    chatId: number,
    text: string,
    replyToMid: string,
    extra?: Record<string, unknown>,
  ): Promise<void> {
    if (!this.api) throw new Error('MAX adapter not started');
    await this.api.sendMessageToChat(chatId, text, {
      ...extra,
      link: { type: 'reply', mid: replyToMid },
    });
  }

  isStopped(): boolean {
    return this.stopped;
  }
}
