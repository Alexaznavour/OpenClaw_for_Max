import type { MaxAccountConfig, MaxUpdate, MessageEnvelope } from './types.js';
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
export type MaxAdapterMode = 'webhook' | 'polling';
/**
 * Adapter that wraps @maxhub/max-bot-api Bot class.
 * Webhook mode initializes the MAX API client for outbound calls and accepts
 * updates through handleWebhookUpdate(). Polling remains available as an
 * explicit fallback for local development.
 */
export declare class MaxAdapter {
    private readonly opts;
    private bot;
    private api;
    private stopped;
    private BotClass;
    private lastPollOk;
    private reconnectAttempt;
    private readonly seenWebhookUpdateKeys;
    private readonly seenWebhookUpdateQueue;
    private readonly token;
    private readonly mediaMaxMb;
    private readonly onMessage;
    private readonly onReady;
    private readonly onError;
    private readonly logger;
    constructor(opts: MaxAdapterOptions);
    /**
     * Start the adapter in webhook mode by default.
     */
    start(mode?: MaxAdapterMode): Promise<void>;
    /**
     * Initialize MAX API without starting Long Polling.
     */
    startWebhook(): Promise<void>;
    /**
     * Start Long Polling with supervised reconnect loop. This is intended only
     * as an explicit fallback because MAX now limits Long Polling in production.
     */
    startPolling(): Promise<void>;
    private initializeBot;
    /**
     * Create a fresh Bot instance, register handlers, verify connection, start polling.
     * On polling crash — automatically retries with backoff unless stopped.
     */
    private connectAndPoll;
    private registerHandlers;
    private handlePollingUpdate;
    handleWebhookUpdate(update: MaxUpdate): Promise<void>;
    private normalizeUpdate;
    private rememberWebhookUpdate;
    private cleanupBot;
    private sleep;
    /**
     * Stop Long Polling and clean up. Only called on abort signal or explicit stop.
     */
    stop(): void;
    getApi(): any;
    getConfig(): MaxAccountConfig;
    sendText(chatId: number, text: string, extra?: Record<string, unknown>): Promise<void>;
    sendReply(chatId: number, text: string, replyToMid: string, extra?: Record<string, unknown>): Promise<void>;
    isStopped(): boolean;
}
