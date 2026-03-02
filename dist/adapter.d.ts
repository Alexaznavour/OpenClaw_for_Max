import type { MaxAccountConfig, MessageEnvelope } from './types.js';
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
 * Uses Long Polling with supervised auto-reconnect on transient errors.
 */
export declare class MaxAdapter {
    private readonly opts;
    private bot;
    private api;
    private stopped;
    private BotClass;
    private lastPollOk;
    private reconnectAttempt;
    private readonly token;
    private readonly mediaMaxMb;
    private readonly onMessage;
    private readonly onReady;
    private readonly onError;
    private readonly logger;
    constructor(opts: MaxAdapterOptions);
    /**
     * Start Long Polling with supervised reconnect loop.
     */
    start(): Promise<void>;
    /**
     * Create a fresh Bot instance, register handlers, verify connection, start polling.
     * On polling crash — automatically retries with backoff unless stopped.
     */
    private connectAndPoll;
    private registerHandlers;
    private cleanupBot;
    private sleep;
    /**
     * Stop Long Polling and clean up. Only called on abort signal or explicit stop.
     */
    stop(): void;
    getApi(): any;
    sendText(chatId: number, text: string, extra?: Record<string, unknown>): Promise<void>;
    sendReply(chatId: number, text: string, replyToMid: string, extra?: Record<string, unknown>): Promise<void>;
    isStopped(): boolean;
}
