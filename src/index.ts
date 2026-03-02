import type {
  OpenClawPluginApi,
  PluginRuntime,
  OpenClawConfig,
  ChannelGatewayContext,
  ChannelOutboundContext,
  MsgContext,
  ReplyPayload,
} from 'openclaw/plugin-sdk';
import { emptyPluginConfigSchema } from 'openclaw/plugin-sdk';
import { setRuntime, getRuntime } from './runtime.js';
import { MaxAdapter } from './adapter.js';
import { uploadAndSendMedia } from './media.js';
import type { MaxAccountConfig, MessageEnvelope } from './types.js';

const CHANNEL_ID = 'max';

function formatError(err: unknown): string {
  if (err instanceof Error) return err.stack ?? err.message;
  if (typeof err === 'string') return err;
  try { return JSON.stringify(err); } catch { return String(err); }
}

const adapters = new Map<string, MaxAdapter>();

const maxPlugin = {
  id: CHANNEL_ID,

  meta: {
    id: CHANNEL_ID,
    label: 'MAX Messenger',
    selectionLabel: 'MAX (Messenger)',
    docsPath: '/channels/max',
    blurb: 'Connect your AI agent to MAX messenger — text, voice, images, video, inline buttons.',
    aliases: ['max'],
  },

  configSchema: {
    schema: {
      type: 'object' as const,
      properties: {
        botToken: { type: 'string' },
        enabled: { type: 'boolean', default: true },
        dmPolicy: { type: 'string', default: 'open' },
        allowFrom: { type: 'array', items: { type: 'string' } },
        groupPolicy: { type: 'string', default: 'allowlist' },
        groupAllowFrom: { type: 'array', items: { type: 'string' } },
        groups: { type: 'object', additionalProperties: true },
        requireMention: { type: 'boolean', default: true },
        mediaMaxMb: { type: 'number', default: 5 },
        streaming: { type: 'string', default: 'off' },
        textChunkLimit: { type: 'number', default: 4000 },
      },
      required: ['botToken'],
    },
  },

  capabilities: {
    chatTypes: ['direct', 'group'] as const,
  },

  config: {
    listAccountIds: (cfg: OpenClawConfig): string[] => {
      const max = (cfg.channels as any)?.max;
      if (!max) return [];
      if (max.accounts && Object.keys(max.accounts).length > 0) {
        return Object.keys(max.accounts);
      }
      if (max.botToken || process.env.MAX_BOT_TOKEN) {
        return ['default'];
      }
      return [];
    },

    resolveAccount: (
      cfg: OpenClawConfig,
      accountId?: string | null,
    ): MaxAccountConfig & { accountId: string } => {
      const channels = cfg.channels as any;
      const id = accountId ?? 'default';

      // Try nested accounts form first, then flat form
      const account = channels?.max?.accounts?.[id] ?? channels?.max ?? {};

      // Resolve token from config or env
      const botToken =
        account.botToken ??
        channels?.max?.botToken ??
        process.env.MAX_BOT_TOKEN ??
        '';

      return { accountId: id, ...account, botToken };
    },
  },

  outbound: {
    deliveryMode: 'direct' as const,

    sendText: async (ctx: ChannelOutboundContext): Promise<{ ok: boolean }> => {
      const adapter = adapters.get(ctx.accountId ?? 'default');
      if (!adapter) return { ok: false };

      const rawTo = ctx.to?.replace(/^max:/, '') ?? '';
      const chatId = parseInt(rawTo, 10);
      if (isNaN(chatId)) {
        console.error(`[MAX] sendText: invalid chatId from ctx.to="${ctx.to}"`);
        return { ok: false };
      }

      try {
        const mediaUrl = ctx.mediaUrl;
        const mediaUrls = ctx.mediaUrls as string[] | undefined;

        if (mediaUrl) {
          await uploadAndSendMedia(adapter.getApi(), chatId, mediaUrl, ctx.text);
        } else if (mediaUrls?.length) {
          await uploadAndSendMedia(adapter.getApi(), chatId, mediaUrls[0], ctx.text);
          for (let i = 1; i < mediaUrls.length; i++) {
            await uploadAndSendMedia(adapter.getApi(), chatId, mediaUrls[i]);
          }
        } else {
          const btnResult = await resolveButtons(ctx.text, ctx as Record<string, unknown>);
          if (btnResult) {
            await adapter.sendText(chatId, btnResult.cleanText, {
              format: 'markdown',
              attachments: [btnResult.keyboard],
            });
          } else {
            await adapter.sendText(chatId, ctx.text, {
              format: 'markdown',
            });
          }
        }

        return { ok: true };
      } catch (err) {
        console.error('[MAX] sendText error:', err);
        return { ok: false };
      }
    },
  },

  gateway: {
    startAccount: async (
      ctx: ChannelGatewayContext<MaxAccountConfig>,
    ): Promise<unknown> => {
      const rt = getRuntime();
      const { cfg, accountId, account, abortSignal, log } = ctx;

      log?.info?.(`[MAX] startAccount called for ${accountId}`);

      ctx.setStatus({
        accountId,
        running: true,
        connected: false,
        lastStartAt: Date.now(),
      });

      // Stop existing adapter if any (prevent duplicate connections)
      const existing = adapters.get(accountId);
      if (existing) {
        existing.stop();
      }

      const adapter = new MaxAdapter({
        config: account,
        logger: log,
        signal: abortSignal,

        onReady: () => {
          ctx.setStatus({
            accountId,
            running: true,
            connected: true,
            lastConnectedAt: Date.now(),
            lastError: null,
          });
          log?.info?.('[MAX] Bot connected and polling');
        },

        onError: (err) => {
          const detail = err instanceof Error ? (err.stack ?? err.message) : String(err);
          log?.error?.(`[MAX] Adapter error: ${detail}`);
          ctx.setStatus({
            ...ctx.getStatus(),
            lastError: detail,
            lastErrorAt: Date.now(),
          });
        },

        onMessage: async (envelope: MessageEnvelope) => {
          log?.info?.(
            `[MAX] Inbound: ${envelope.id} from=${envelope.sender.name} ` +
            `chat=${envelope.chatId} type=${envelope.chatType}`,
          );

          // ── Step 0: Check dmPolicy / groupPolicy ──
          if (envelope.chatType === 'direct') {
            const policy = account.dmPolicy ?? 'open';
            if (policy === 'disabled') return;
            if (policy === 'allowlist') {
              const allow = account.allowFrom ?? [];
              const senderId = String(envelope.sender.id);
              const chatId = String(envelope.chatId);
              if (!allow.includes('*') && !allow.includes(senderId) && !allow.includes(chatId)) {
                log?.debug?.(`[MAX] Ignoring DM from ${senderId} (not in allowFrom)`);
                return;
              }
            }
          } else if (envelope.chatType === 'group') {
            const chatId = String(envelope.chatId);
            const groupCfg = account.groups?.[chatId] ?? account.groups?.['*'];
            const groupPolicy = groupCfg?.groupPolicy ?? account.groupPolicy ?? 'disabled';
            if (groupPolicy === 'disabled') return;
            if (groupPolicy === 'allowlist') {
              const allow = groupCfg?.allowFrom ?? account.groupAllowFrom ?? [];
              const senderId = String(envelope.sender.id);
              if (!allow.includes('*') && !allow.includes(senderId) && !allow.includes(chatId)) {
                log?.debug?.(`[MAX] Ignoring group msg from ${senderId} in ${chatId} (not in groupAllowFrom)`);
                return;
              }
            }
          }

          // ── Step 1: Resolve agent route ──
          let route;
          try {
            const peer = {
              kind: envelope.chatType as 'direct' | 'group',
              id: String(envelope.chatId),
            };
            route = await rt.channel.routing.resolveAgentRoute({
              cfg,
              channel: CHANNEL_ID,
              accountId,
              peer,
              chatType: envelope.chatType,
              peerId: envelope.sender.id,
              senderId: envelope.sender.id,
              ...(envelope.chatType === 'group'
                ? { groupId: String(envelope.chatId) }
                : {}),
            });

            // Fallback: override sessionKey if runtime ignored the `peer` param
            const dmScope = (cfg as any).session?.dmScope ?? 'per-channel-peer';
            if (envelope.chatType === 'direct' && dmScope === 'per-channel-peer') {
              route.sessionKey = `agent:${route.agentId}:${CHANNEL_ID}:direct:${envelope.chatId}`;
            } else if (envelope.chatType === 'group') {
              route.sessionKey = `agent:${route.agentId}:${CHANNEL_ID}:group:${envelope.chatId}`;
            }

            log?.info?.(`[MAX] Route: agent=${route.agentId} session=${route.sessionKey}`);
          } catch (err) {
            log?.error?.(`[MAX] resolveAgentRoute failed: ${formatError(err)}`);
            throw err;
          }

          // ── Step 2: Build MsgContext ──
          const rawCtx: MsgContext = {
            Body: envelope.content.text,
            RawBody: envelope.content.text,
            CommandBody: envelope.content.text,
            From: `${CHANNEL_ID}:${envelope.sender.id}`,
            To: `${CHANNEL_ID}:${accountId}`,
            SessionKey: route.sessionKey,
            AccountId: accountId,
            ChatType: envelope.chatType,
            ConversationLabel: envelope.sender.name,
            SenderName: envelope.sender.name,
            SenderId: envelope.sender.id,
            Provider: CHANNEL_ID,
            Surface: CHANNEL_ID,
            MessageSid: envelope.id,
            Timestamp: envelope.timestamp,
            OriginatingChannel: CHANNEL_ID,
            OriginatingTo: `${CHANNEL_ID}:${accountId}`,
          };

          // Attach reply metadata if present
          if (envelope.metadata.replyToId) {
            rawCtx.ReplyToId = envelope.metadata.replyToId as string;
          }
          if (envelope.metadata.replyToBody) {
            rawCtx.ReplyToBody = envelope.metadata.replyToBody as string;
          }
          if (envelope.metadata.replyToSender) {
            rawCtx.ReplyToSender = envelope.metadata.replyToSender as string;
          }

          log?.info?.(`[MAX] MsgContext built, SessionKey=${rawCtx.SessionKey}`);

          // ── Step 3: Finalize inbound context ──
          let msgCtx: MsgContext;
          try {
            msgCtx = rt.channel.reply.finalizeInboundContext(rawCtx);
            log?.info?.(`[MAX] Finalized, CommandAuthorized=${msgCtx.CommandAuthorized}`);
          } catch (err) {
            log?.error?.(`[MAX] finalizeInboundContext failed: ${formatError(err)}`);
            throw err;
          }

          // ── Step 4: Record inbound session ──
          try {
            const sessionObj = rt.channel.session;
            const storePath = (
              sessionObj.resolveStorePath as (
                store?: string,
                opts?: { agentId?: string },
              ) => string
            )((cfg as any).session?.store, { agentId: route.agentId });

            await (sessionObj.recordInboundSession as any)({
              storePath,
              sessionKey: msgCtx.SessionKey ?? route.sessionKey,
              ctx: msgCtx,
              updateLastRoute: {
                sessionKey: route.mainSessionKey ?? route.sessionKey,
                channel: CHANNEL_ID,
                to: `${CHANNEL_ID}:${accountId}`,
                accountId,
              },
              onRecordError: (err: unknown) => {
                log?.error?.(`[MAX] recordInboundSession onRecordError: ${formatError(err)}`);
              },
            });
            log?.info?.('[MAX] Session recorded');
          } catch (err) {
            log?.error?.(`[MAX] recordInboundSession failed: ${formatError(err)}`);
            throw err;
          }

          // ── Step 5: Dispatch — triggers the agent turn ──
          try {
            const targetChatId = envelope.chatId;

            await rt.channel.reply.dispatchReplyWithBufferedBlockDispatcher({
              ctx: msgCtx,
              cfg,
              dispatcherOptions: {
                deliver: async (payload: ReplyPayload) => {
                  const text = payload.text;
                  log?.info?.(
                    `[MAX] Deliver: text=${text ? text.slice(0, 80) + '...' : '(empty)'}`,
                  );
                  if (!text && !payload.mediaUrl && !payload.mediaUrls?.length) return;

                  try {
                    const api = adapter.getApi();
                    const mediaUrl = payload.mediaUrl;
                    const mediaUrls = payload.mediaUrls;

                    if (mediaUrl) {
                      await uploadAndSendMedia(api, targetChatId, mediaUrl, text);
                    } else if (mediaUrls?.length) {
                      await uploadAndSendMedia(
                        api,
                        targetChatId,
                        mediaUrls[0],
                        text,
                      );
                      for (let i = 1; i < mediaUrls.length; i++) {
                        await uploadAndSendMedia(api, targetChatId, mediaUrls[i]);
                      }
                    } else if (text) {
                      const chunkLimit = account.textChunkLimit ?? 4000;
                      const btnResult = await resolveButtons(text, payload as Record<string, unknown>);

                      if (btnResult) {
                        const chunks = chunkText(btnResult.cleanText, chunkLimit);
                        for (let i = 0; i < chunks.length - 1; i++) {
                          await adapter.sendText(targetChatId, chunks[i], {
                            format: 'markdown',
                          });
                        }
                        await adapter.sendText(
                          targetChatId,
                          chunks[chunks.length - 1] || '',
                          {
                            format: 'markdown',
                            attachments: [btnResult.keyboard],
                          },
                        );
                        log?.info?.(`[MAX] Sent with inline keyboard (${btnResult.cleanText.length} chars)`);
                      } else {
                        const chunks = chunkText(text, chunkLimit);
                        for (const chunk of chunks) {
                          await adapter.sendText(targetChatId, chunk, {
                            format: 'markdown',
                          });
                        }
                      }
                    }
                  } catch (err) {
                    log?.error?.(`[MAX] Deliver error: ${formatError(err)}`);
                  }
                },
                onError: (err, info) => {
                  log?.error?.(`[MAX] Dispatch onError (${info.kind}): ${formatError(err)}`);
                },
              },
            });
            log?.info?.('[MAX] Dispatch complete');
          } catch (err) {
            log?.error?.(`[MAX] Dispatch failed: ${formatError(err)}`);
            throw err;
          }
        },
      });

      adapters.set(accountId, adapter);

      log?.info?.('[MAX] Starting adapter...');
      await adapter.start();
      log?.info?.('[MAX] Adapter started');

      // Keep-alive promise: stays pending until abort signal fires.
      // Same pattern as the reference openclawcity plugin and built-in channels.
      return new Promise<void>((resolve) => {
        const onAbort = () => {
          log?.info?.(`[MAX] Abort signal — shutting down account ${accountId}`);
          adapter.stop();
          adapters.delete(accountId);
          ctx.setStatus({
            accountId,
            running: false,
            connected: false,
            lastStopAt: Date.now(),
          });
          resolve();
        };
        if (abortSignal.aborted) {
          onAbort();
        } else {
          abortSignal.addEventListener('abort', onAbort, { once: true });
        }
      });
    },
  },
};

// ── Inline buttons support ──

interface ParsedButton {
  text: string;
  payload?: string;
  url?: string;
}

/**
 * Extract inline button markup from text.
 * Syntax: <<Button Text>> or <<Button Text|callback_data>> or <<Button Text|https://example.com>>
 * Uses double angle brackets to avoid collisions with JSON arrays, Markdown links, etc.
 * Buttons on the same line form a single row.
 */
function extractInlineButtons(text: string): {
  cleanText: string;
  rows: ParsedButton[][];
} | null {
  const btnRe = /<<([^>|]+?)(?:\|(.*?))?>>/g;
  const lines = text.split('\n');
  const clean: string[] = [];
  const rows: ParsedButton[][] = [];

  for (const line of lines) {
    const matches = [...line.matchAll(btnRe)];
    if (matches.length === 0) {
      clean.push(line);
      continue;
    }
    const row: ParsedButton[] = [];
    for (const m of matches) {
      const label = m[1].trim();
      const value = m[2]?.trim();
      if (value && /^https?:\/\//.test(value)) {
        row.push({ text: label, url: value });
      } else {
        row.push({ text: label, payload: value || label });
      }
    }
    rows.push(row);
    const leftover = line.replace(/<<([^>|]+?)(?:\|(.*?))?>>/g, '').trim();
    if (leftover) clean.push(leftover);
  }

  if (rows.length === 0) return null;
  return {
    cleanText: clean.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
    rows,
  };
}

/**
 * Build a MAX InlineKeyboardAttachment from parsed button rows.
 * Uses Keyboard helpers from @maxhub/max-bot-api.
 */
async function buildMaxKeyboard(rows: ParsedButton[][]): Promise<unknown> {
  const { Keyboard } = await import('@maxhub/max-bot-api');
  const kbRows = rows.map(row =>
    row.map(btn =>
      btn.url
        ? Keyboard.button.link(btn.text, btn.url)
        : Keyboard.button.callback(btn.text, btn.payload ?? btn.text)
    )
  );
  return Keyboard.inlineKeyboard(kbRows);
}

/**
 * Read buttons from channelData.max.buttons (structured) or parse [[markup]] from text.
 * Returns keyboard attachment and cleaned text, or null if no buttons.
 */
async function resolveButtons(
  text: string | undefined,
  payload: Record<string, unknown>,
): Promise<{ cleanText: string; keyboard: unknown } | null> {
  const maxData = (payload.channelData as any)?.max;
  if (maxData?.buttons?.length) {
    const rows: ParsedButton[][] = maxData.buttons.map((row: any[]) =>
      row.map((btn: any) => ({
        text: btn.text ?? btn.label ?? '',
        payload: btn.payload ?? btn.callback_data,
        url: btn.url,
      }))
    );
    return {
      cleanText: text ?? '',
      keyboard: await buildMaxKeyboard(rows),
    };
  }

  if (!text) return null;
  const parsed = extractInlineButtons(text);
  if (!parsed) return null;
  return {
    cleanText: parsed.cleanText,
    keyboard: await buildMaxKeyboard(parsed.rows),
  };
}

/**
 * Split long text into chunks respecting a character limit.
 * Prefers splitting on paragraph boundaries (blank lines), then newlines.
 */
function chunkText(text: string, limit: number): string[] {
  if (text.length <= limit) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > limit) {
    let splitAt = remaining.lastIndexOf('\n\n', limit);
    if (splitAt <= 0) splitAt = remaining.lastIndexOf('\n', limit);
    if (splitAt <= 0) splitAt = remaining.lastIndexOf(' ', limit);
    if (splitAt <= 0) splitAt = limit;

    chunks.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt).trimStart();
  }

  if (remaining) chunks.push(remaining);
  return chunks;
}

// ── Plugin export ──

const plugin = {
  id: CHANNEL_ID,
  name: 'MAX Messenger Channel',
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi): void {
    setRuntime(api.runtime);
    api.registerChannel({ plugin: maxPlugin });
  },
};

export default plugin;
