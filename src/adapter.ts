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

/**
 * Adapter that wraps @maxhub/max-bot-api Bot class.
 * Uses Long Polling to receive updates and provides outbound send methods.
 */
export class MaxAdapter {
  private bot: any = null;
  private api: any = null;
  private stopped = false;

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
   * Start Long Polling and register update handlers.
   */
  async start(): Promise<void> {
    if (this.stopped) return;

    // Dynamic import so the module is resolved at runtime by the host
    const maxBotApi = await import('@maxhub/max-bot-api');
    const Bot = maxBotApi.Bot;

    this.bot = new Bot(this.token);
    this.api = this.bot.api;

    // Handle /start (bot_started)
    this.bot.on('bot_started', async (ctx: any) => {
      try {
        const update = ctx.update as MaxUpdate;
        const envelope = normalizeBotStarted(update);
        if (envelope) {
          await this.onMessage(envelope);
        }
      } catch (err) {
        this.logger.error?.('[MAX] Error handling bot_started:', err);
        this.onError?.(err);
      }
    });

    // Handle new messages (text, voice, images, etc.)
    this.bot.on('message_created', async (ctx: any) => {
      try {
        const update = ctx.update as MaxUpdate;
        const envelope = await normalizeMessage(update, this.mediaMaxMb);
        if (envelope) {
          await this.onMessage(envelope);
        }
      } catch (err) {
        this.logger.error?.('[MAX] Error handling message_created:', err);
        this.onError?.(err);
      }
    });

    // Handle edited messages
    this.bot.on('message_edited', async (ctx: any) => {
      try {
        const update = ctx.update as MaxUpdate;
        const envelope = await normalizeMessage(update, this.mediaMaxMb);
        if (envelope) {
          envelope.metadata.edited = true;
          await this.onMessage(envelope);
        }
      } catch (err) {
        this.logger.error?.('[MAX] Error handling message_edited:', err);
        this.onError?.(err);
      }
    });

    // Handle inline button callbacks
    this.bot.on('message_callback', async (ctx: any) => {
      try {
        const update = ctx.update as MaxUpdate;
        const envelope = normalizeCallback(update);
        if (envelope) {
          await this.onMessage(envelope);
        }
      } catch (err) {
        this.logger.error?.('[MAX] Error handling message_callback:', err);
        this.onError?.(err);
      }
    });

    // Handle errors
    this.bot.catch((err: unknown) => {
      this.logger.error?.('[MAX] Bot error:', err);
      this.onError?.(err);
    });

    this.logger.info?.('[MAX] Starting Long Polling...');

    // Fetch bot info to confirm connection, then start polling
    try {
      const info = await this.api.getMyInfo();
      this.logger.info?.(`[MAX] Connected as @${info.username ?? info.name ?? 'bot'}`);
      this.onReady?.();
    } catch (err) {
      this.logger.error?.('[MAX] Failed to fetch bot info:', err);
    }

    // bot.start() runs Long Polling in a loop — it never resolves until stopped
    this.bot.start().catch((err: unknown) => {
      if (!this.stopped) {
        this.logger.error?.('[MAX] Polling loop error:', err);
        this.onError?.(err);
      }
    });
  }

  /**
   * Stop Long Polling and clean up.
   */
  stop(): void {
    if (this.stopped) return;
    this.stopped = true;
    try {
      this.bot?.stop?.();
    } catch {
      // ignore stop errors
    }
    this.logger.info?.('[MAX] Adapter stopped');
  }

  /**
   * Get the underlying MAX Bot API instance for outbound operations.
   */
  getApi(): any {
    return this.api;
  }

  /**
   * Send a text message to a chat.
   */
  async sendText(
    chatId: number,
    text: string,
    extra?: Record<string, unknown>,
  ): Promise<void> {
    if (!this.api) throw new Error('MAX adapter not started');
    await this.api.sendMessageToChat(chatId, text, extra);
  }

  /**
   * Send a text message with a reply link to the original message.
   */
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
