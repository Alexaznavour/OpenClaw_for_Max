import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';

const MEDIA_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'audio/ogg': '.ogg',
  'audio/mpeg': '.mp3',
  'audio/mp4': '.m4a',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'application/pdf': '.pdf',
};

function tempDir(): string {
  const dir = path.join(os.tmpdir(), 'openclaw-max-media');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function uniqueFilename(ext: string): string {
  return `max-${crypto.randomUUID()}${ext}`;
}

/**
 * Download a file from a URL to a local temp path.
 * Returns the local file path.
 */
export async function downloadMedia(
  url: string,
  maxMb = 20,
): Promise<{ localPath: string; mimeType: string }> {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to download media: ${resp.status} ${resp.statusText}`);
  }

  const contentType = resp.headers.get('content-type') ?? 'application/octet-stream';
  const mimeBase = contentType.split(';')[0].trim();
  const ext = MEDIA_EXTENSIONS[mimeBase] ?? extensionFromUrl(url) ?? '.bin';

  const contentLength = resp.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > maxMb * 1024 * 1024) {
    throw new Error(`Media too large: ${contentLength} bytes (max ${maxMb}MB)`);
  }

  const buffer = Buffer.from(await resp.arrayBuffer());
  if (buffer.length > maxMb * 1024 * 1024) {
    throw new Error(`Media too large: ${buffer.length} bytes (max ${maxMb}MB)`);
  }

  const filename = uniqueFilename(ext);
  const localPath = path.join(tempDir(), filename);
  await fs.promises.writeFile(localPath, buffer);

  return { localPath, mimeType: mimeBase };
}

function extensionFromUrl(url: string): string | null {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname);
    return ext || null;
  } catch {
    return null;
  }
}

/**
 * Detect media type from a URL based on extension or content-type header.
 */
export function detectMediaType(url: string): 'image' | 'audio' | 'video' | 'file' {
  const lower = url.toLowerCase();
  if (/\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/.test(lower)) return 'image';
  if (/\.(mp3|ogg|oga|opus|wav|m4a|aac|flac)(\?|$)/.test(lower)) return 'audio';
  if (/\.(mp4|webm|mov|avi|mkv)(\?|$)/.test(lower)) return 'video';
  return 'file';
}

export interface MaxApi {
  sendMessageToChat: (chatId: number, text: string, extra?: Record<string, unknown>) => Promise<unknown>;
  uploadImage: (opts: { source: string } | { url: string }) => Promise<{ toJson: () => unknown }>;
  uploadAudio: (opts: { source: string }) => Promise<{ toJson: () => unknown }>;
  uploadVideo: (opts: { source: string }) => Promise<{ toJson: () => unknown }>;
  uploadFile: (opts: { source: string }) => Promise<{ toJson: () => unknown }>;
}

/**
 * Upload a media file to MAX and send it in a chat message.
 */
export async function uploadAndSendMedia(
  api: MaxApi,
  chatId: number,
  mediaUrl: string,
  text?: string,
): Promise<void> {
  const type = detectMediaType(mediaUrl);

  if (type === 'image' && /^https?:\/\//.test(mediaUrl)) {
    const attachment = await api.uploadImage({ url: mediaUrl });
    await api.sendMessageToChat(chatId, text ?? '', {
      attachments: [attachment.toJson()],
    });
    return;
  }

  const { localPath } = await downloadMedia(mediaUrl);

  try {
    let attachment: { toJson: () => unknown };

    switch (type) {
      case 'image':
        attachment = await api.uploadImage({ source: localPath });
        break;
      case 'audio':
        attachment = await api.uploadAudio({ source: localPath });
        break;
      case 'video':
        attachment = await api.uploadVideo({ source: localPath });
        break;
      default:
        attachment = await api.uploadFile({ source: localPath });
        break;
    }

    await api.sendMessageToChat(chatId, text ?? '', {
      attachments: [attachment.toJson()],
    });
  } finally {
    fs.promises.unlink(localPath).catch(() => {});
  }
}
