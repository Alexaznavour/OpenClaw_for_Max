/**
 * Download a file from a URL to a local temp path.
 * Returns the local file path.
 */
export declare function downloadMedia(url: string, maxMb?: number): Promise<{
    localPath: string;
    mimeType: string;
}>;
/**
 * Detect media type from a URL based on extension or content-type header.
 */
export declare function detectMediaType(url: string): 'image' | 'audio' | 'video' | 'file';
export interface MaxApi {
    sendMessageToChat: (chatId: number, text: string, extra?: Record<string, unknown>) => Promise<unknown>;
    uploadImage: (opts: {
        source: string;
    } | {
        url: string;
    }) => Promise<{
        toJson: () => unknown;
    }>;
    uploadAudio: (opts: {
        source: string;
    }) => Promise<{
        toJson: () => unknown;
    }>;
    uploadVideo: (opts: {
        source: string;
    }) => Promise<{
        toJson: () => unknown;
    }>;
    uploadFile: (opts: {
        source: string;
    }) => Promise<{
        toJson: () => unknown;
    }>;
}
/**
 * Upload a media file to MAX and send it in a chat message.
 */
export declare function uploadAndSendMedia(api: MaxApi, chatId: number, mediaUrl: string, text?: string): Promise<void>;
