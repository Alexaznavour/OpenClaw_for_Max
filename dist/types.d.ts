export interface MaxAccountConfig {
    botToken: string;
    enabled?: boolean;
    deliveryMode?: 'webhook' | 'polling';
    webhookUrl?: string;
    webhookPath?: string;
    webhookSecret?: string;
    webhookUpdateTypes?: string[];
    autoSubscribe?: boolean;
    dmPolicy?: 'pairing' | 'allowlist' | 'open' | 'disabled';
    allowFrom?: string[];
    groupPolicy?: 'open' | 'allowlist' | 'disabled';
    groupAllowFrom?: string[];
    groups?: Record<string, MaxGroupConfig>;
    requireMention?: boolean;
    mediaMaxMb?: number;
    streaming?: 'off' | 'partial' | 'block';
    textChunkLimit?: number;
    linkPreview?: boolean;
}
export interface MaxGroupConfig {
    requireMention?: boolean;
    groupPolicy?: 'open' | 'allowlist' | 'disabled';
    allowFrom?: string[];
    enabled?: boolean;
    systemPrompt?: string;
}
export interface MessageEnvelope {
    id: string;
    timestamp: number;
    channelId: string;
    chatType: 'direct' | 'group';
    chatId: number;
    sender: {
        id: string;
        name: string;
        username?: string;
    };
    content: {
        text: string;
        mediaFiles?: MediaFile[];
    };
    metadata: Record<string, unknown>;
}
export interface MediaFile {
    type: 'image' | 'audio' | 'video' | 'file' | 'sticker';
    localPath: string;
    mimeType?: string;
    originalUrl?: string;
}
export interface MaxAttachment {
    type: string;
    payload?: Record<string, unknown>;
    url?: string;
    latitude?: number;
    longitude?: number;
    width?: number;
    height?: number;
    [key: string]: unknown;
}
export interface MaxMessageBody {
    mid: string;
    seq?: number;
    text?: string;
    attachments?: MaxAttachment[];
    markup?: string;
    [key: string]: unknown;
}
export interface MaxSender {
    user_id: number;
    name: string;
    username?: string;
    [key: string]: unknown;
}
export interface MaxRecipient {
    chat_id: number;
    chat_type: string;
    [key: string]: unknown;
}
export interface MaxMessage {
    sender?: MaxSender;
    recipient: MaxRecipient;
    body: MaxMessageBody;
    timestamp: number;
    link?: {
        type: string;
        mid?: string;
        message?: MaxMessage;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}
export interface MaxUpdate {
    update_type: string;
    timestamp: number;
    message?: MaxMessage;
    chat_id?: number;
    user?: MaxSender;
    callback?: {
        callback_id: string;
        payload?: string;
        user: MaxSender;
        [key: string]: unknown;
    };
    message_id?: string;
    payload?: string | null;
    [key: string]: unknown;
}
