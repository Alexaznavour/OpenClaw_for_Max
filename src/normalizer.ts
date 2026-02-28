import type { MaxUpdate, MaxMessage, MaxAttachment, MessageEnvelope, MediaFile } from './types.js';
import { downloadMedia } from './media.js';

const CHANNEL_ID = 'max';

/**
 * Extract the URL from a MAX attachment payload.
 * Different attachment types store the URL in different places.
 */
function extractAttachmentUrl(att: MaxAttachment): string | undefined {
  if (att.url) return att.url;
  const payload = att.payload as Record<string, unknown> | undefined;
  if (!payload) return undefined;
  if (typeof payload.url === 'string') return payload.url;
  if (typeof payload.token === 'string') return undefined;
  return undefined;
}

/**
 * Process a single attachment: download the file and return a MediaFile descriptor.
 */
async function processAttachment(
  att: MaxAttachment,
  maxMb: number,
): Promise<{ media?: MediaFile; placeholder: string }> {
  const attType = att.type;
  const url = extractAttachmentUrl(att);

  switch (attType) {
    case 'image': {
      if (!url) return { placeholder: '[image attachment — no URL]' };
      try {
        const { localPath, mimeType } = await downloadMedia(url, maxMb);
        const media: MediaFile = { type: 'image', localPath, mimeType, originalUrl: url };
        return { media, placeholder: `<<image:${localPath}>>` };
      } catch {
        return { placeholder: `[image: ${url}]` };
      }
    }

    case 'audio': {
      if (!url) return { placeholder: '[audio attachment — no URL]' };
      try {
        const { localPath, mimeType } = await downloadMedia(url, maxMb);
        const media: MediaFile = { type: 'audio', localPath, mimeType, originalUrl: url };
        return { media, placeholder: `<<audio:${localPath}>>` };
      } catch {
        return { placeholder: `[audio: ${url}]` };
      }
    }

    case 'video': {
      if (!url) return { placeholder: '[video attachment — no URL]' };
      try {
        const { localPath, mimeType } = await downloadMedia(url, maxMb);
        const media: MediaFile = { type: 'video', localPath, mimeType, originalUrl: url };
        return { media, placeholder: `<<video:${localPath}>>` };
      } catch {
        return { placeholder: `[video: ${url}]` };
      }
    }

    case 'file': {
      if (!url) return { placeholder: '[file attachment — no URL]' };
      try {
        const { localPath, mimeType } = await downloadMedia(url, maxMb);
        const media: MediaFile = { type: 'file', localPath, mimeType, originalUrl: url };
        return { media, placeholder: `<<file:${localPath}>>` };
      } catch {
        return { placeholder: `[file: ${url}]` };
      }
    }

    case 'sticker': {
      const payload = att.payload as Record<string, unknown> | undefined;
      const stickerUrl = payload?.url as string | undefined;
      const code = payload?.code as string | undefined;
      if (stickerUrl) {
        try {
          const { localPath, mimeType } = await downloadMedia(stickerUrl, maxMb);
          const media: MediaFile = { type: 'sticker', localPath, mimeType, originalUrl: stickerUrl };
          return { media, placeholder: `<<image:${localPath}>>` };
        } catch {
          return { placeholder: `[sticker: ${code ?? stickerUrl}]` };
        }
      }
      return { placeholder: `[sticker: ${code ?? 'unknown'}]` };
    }

    case 'location': {
      const lat = att.latitude ?? 0;
      const lon = att.longitude ?? 0;
      return { placeholder: `[location: ${lat}, ${lon}]` };
    }

    case 'contact': {
      const payload = att.payload as Record<string, unknown> | undefined;
      const vcf = payload?.vcf_info as string | undefined;
      return { placeholder: vcf ? `[contact: ${vcf}]` : '[contact]' };
    }

    case 'share': {
      const payload = att.payload as Record<string, unknown> | undefined;
      const shareUrl = payload?.url as string | undefined;
      return { placeholder: shareUrl ? `[shared: ${shareUrl}]` : '[share]' };
    }

    default:
      return { placeholder: `[attachment: ${attType}]` };
  }
}

/**
 * Build reply context string (similar to Telegram's [Replying to ...] block).
 */
function buildReplyContext(message: MaxMessage): {
  replyText: string;
  replyToId?: string;
  replyToBody?: string;
  replyToSender?: string;
} | null {
  if (!message.link || message.link.type !== 'reply') return null;

  const linked = message.link.message;
  if (!linked) {
    return message.link.mid
      ? { replyText: '', replyToId: message.link.mid }
      : null;
  }

  const senderName = linked.sender?.name ?? 'Unknown';
  const body = linked.body?.text ?? '';
  const mid = linked.body?.mid ?? message.link.mid;

  return {
    replyText: `[Replying to ${senderName}: ${body.slice(0, 200)}]\n`,
    replyToId: mid,
    replyToBody: body,
    replyToSender: senderName,
  };
}

/**
 * Normalize a MAX message_created update into an OpenClaw MessageEnvelope.
 */
export async function normalizeMessage(
  update: MaxUpdate,
  maxMb = 5,
): Promise<MessageEnvelope | null> {
  const message = update.message;
  if (!message) return null;

  const sender = message.sender;
  const senderId = sender?.user_id?.toString() ?? 'unknown';
  const senderName = sender?.name ?? 'Unknown';
  const senderUsername = sender?.username;
  const chatId = message.recipient?.chat_id;
  const chatType = message.recipient?.chat_type === 'dialog' ? 'direct' as const : 'group' as const;
  const mid = message.body?.mid ?? `max-${update.timestamp}`;
  const timestamp = message.timestamp ?? update.timestamp ?? Date.now();

  const parts: string[] = [];
  const mediaFiles: MediaFile[] = [];

  const reply = buildReplyContext(message);
  if (reply?.replyText) {
    parts.push(reply.replyText);
  }

  const text = message.body?.text;
  if (text) {
    parts.push(text);
  }

  const attachments = message.body?.attachments;
  if (attachments?.length) {
    for (const att of attachments) {
      const { media, placeholder } = await processAttachment(att as MaxAttachment, maxMb);
      if (media) mediaFiles.push(media);
      parts.push(placeholder);
    }
  }

  const bodyText = parts.join('\n').trim();
  if (!bodyText) return null;

  return {
    id: mid,
    timestamp,
    channelId: CHANNEL_ID,
    chatType,
    chatId,
    sender: {
      id: senderId,
      name: senderName,
      username: senderUsername,
    },
    content: {
      text: bodyText,
      mediaFiles: mediaFiles.length > 0 ? mediaFiles : undefined,
    },
    metadata: {
      updateType: update.update_type,
      ...(reply?.replyToId ? { replyToId: reply.replyToId } : {}),
      ...(reply?.replyToBody ? { replyToBody: reply.replyToBody } : {}),
      ...(reply?.replyToSender ? { replyToSender: reply.replyToSender } : {}),
    },
  };
}

/**
 * Normalize a bot_started update.
 */
export function normalizeBotStarted(update: MaxUpdate): MessageEnvelope | null {
  const user = update.user;
  const chatId = update.chat_id;
  if (!user || !chatId) return null;

  const payload = update.payload;
  const text = payload
    ? `/start ${payload}`
    : '/start';

  return {
    id: `max-start-${update.timestamp}`,
    timestamp: update.timestamp ?? Date.now(),
    channelId: CHANNEL_ID,
    chatType: 'direct',
    chatId,
    sender: {
      id: user.user_id.toString(),
      name: user.name,
      username: user.username,
    },
    content: { text },
    metadata: { updateType: 'bot_started', payload },
  };
}

/**
 * Normalize a message_callback update (inline button press).
 */
export function normalizeCallback(update: MaxUpdate): MessageEnvelope | null {
  const cb = update.callback;
  if (!cb) return null;

  const user = cb.user;
  const chatId = update.chat_id ?? (update.message as MaxMessage | undefined)?.recipient?.chat_id;
  if (!chatId) return null;

  const text = cb.payload ? `callback_data: ${cb.payload}` : '[button pressed]';

  return {
    id: `max-cb-${cb.callback_id}`,
    timestamp: update.timestamp ?? Date.now(),
    channelId: CHANNEL_ID,
    chatType: 'direct',
    chatId,
    sender: {
      id: user.user_id.toString(),
      name: user.name,
      username: user.username,
    },
    content: { text },
    metadata: {
      updateType: 'message_callback',
      callbackId: cb.callback_id,
      callbackPayload: cb.payload,
    },
  };
}
