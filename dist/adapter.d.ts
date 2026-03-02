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
 * Uses Long Polling to receive updates and provides outbound send methods.
 */
export declare class MaxAdapter {
    private readonly opts;
    private bot;
    private api;
    private stopped;
    private readonly token;
    private readonly mediaMaxMb;
    private readonly onMessage;
    private readonly onReady;
    private readonly onError;
    private readonly logger;
    constructor(opts: MaxAdapterOptions);
    /**
     * Start Long Polling and register update handlers.
     */
    start(): Promise<void>;
    /**
     * Stop Long Polling and clean up.
     */
    stop(): void;
    /**
     * Get the underlying MAX Bot API instance for outbound operations.
     */
    getApi(): any;
    /**
     * Send a text message to a chat.
     */
    sendText(chatId: number, text: string, extra?: Record<string, unknown>): Promise<void>;
    /**
     * Send a text message with a reply link to the original message.
     */
    sendReply(chatId: number, text: string, replyToMid: string, extra?: Record<string, unknown>): Promise<void>;
    isStopped(): boolean;
}
