import type { MaxUpdate, MessageEnvelope } from './types.js';
/**
 * Normalize a MAX message_created update into an OpenClaw MessageEnvelope.
 */
export declare function normalizeMessage(update: MaxUpdate, maxMb?: number): Promise<MessageEnvelope | null>;
/**
 * Normalize a bot_started update.
 */
export declare function normalizeBotStarted(update: MaxUpdate): MessageEnvelope | null;
/**
 * Normalize a message_callback update (inline button press).
 */
export declare function normalizeCallback(update: MaxUpdate): MessageEnvelope | null;
