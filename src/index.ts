import type { IncomingMessage, ServerResponse } from 'node:http';
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
import { createMaxSubscription, getMaxSubscriptions } from './subscriptions.js';
import type { MaxAccountConfig, MaxUpdate, MessageEnvelope } from './types.js';

const CHANNEL_ID = 'max';
const DEFAULT_WEBHOOK_PATH = '/webhook/max';
const DEFAULT_WEBHOOK_UPDATE_TYPES = [
  'message_created',
  'message_edited',
  'message_callback',
  'bot_started',
];

function formatError(err: unknown): string {
  if (err instanceof Error) return err.stack ?? err.message;
  if (typeof err === 'string') return err;
  try { return JSON.stringify(err); } catch { return String(err); }
}

const adapters = new Map<string, MaxAdapter>();
const registeredWebhookPaths = new Set<string>();
let pluginApi: OpenClawPluginApi | null = null;

function normalizeWebhookPath(path: string | undefined): string {
  const raw = path?.trim() || DEFAULT_WEBHOOK_PATH;
  const withLeadingSlash = raw.startsWith('/') ? raw : `/${raw}`;
  return withLeadingSlash.replace(/\/+$/, '') || DEFAULT_WEBHOOK_PATH;
}

function resolveWebhookPath(account: MaxAccountConfig): string {
  if (account.webhookPath) {
    return normalizeWebhookPath(account.webhookPath);
  }
  if (account.webhookUrl) {
    try {
      return normalizeWebhookPath(new URL(account.webhookUrl).pathname);
    } catch {
      return DEFAULT_WEBHOOK_PATH;
    }
  }
  return DEFAULT_WEBHOOK_PATH;
}

function resolveDeliveryMode(account: MaxAccountConfig): 'webhook' | 'polling' {
  return account.deliveryMode ?? 'webhook';
}

function getHeader(req: IncomingMessage, name: string): string | undefined {
  const value = req.headers[name.toLowerCase()];
  if (Array.isArray(value)) return value[0];
  return value;
}

function sendTextResponse(res: ServerResponse, statusCode: number, text: string): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(text);
}

async function readJsonBody(req: IncomingMessage, maxBytes = 1024 * 1024): Promise<unknown> {
  const chunks: Buffer[] = [];
  let total = 0;

  for await (const chunk of req) {
    const buffer = typeof chunk === 'string' ? Buffer.from(chunk) : Buffer.from(chunk);
    total += buffer.length;
    if (total > maxBytes) {
      throw new Error('request body too large');
    }
    chunks.push(buffer);
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
}

function isMaxUpdate(value: unknown): value is MaxUpdate {
  return Boolean(
    value &&
    typeof value === 'object' &&
    typeof (value as MaxUpdate).update_type === 'string',
  );
}

function findWebhookTarget(
  req: IncomingMessage,
  webhookPath: string,
): { accountId: string; adapter: MaxAdapter } | null {
  const requestUrl = new URL(req.url ?? webhookPath, 'http://localhost');
  const requestedAccountId = requestUrl.searchParams.get('accountId');
  const providedSecret = getHeader(req, 'x-max-bot-api-secret');

  const candidates = [...adapters.entries()]
    .filter(([, adapter]) => resolveWebhookPath(adapter.getConfig()) === webhookPath);

  if (requestedAccountId) {
    const adapter = adapters.get(requestedAccountId);
    if (!adapter || resolveWebhookPath(adapter.getConfig()) !== webhookPath) {
      return null;
    }
    const expectedSecret = adapter.getConfig().webhookSecret;
    if (expectedSecret && providedSecret !== expectedSecret) {
      return null;
    }
    return { accountId: requestedAccountId, adapter };
  }

  if (providedSecret) {
    const secretMatches = candidates.filter(([, adapter]) =>
      adapter.getConfig().webhookSecret === providedSecret,
    );
    if (secretMatches.length === 1) {
      const [accountId, adapter] = secretMatches[0];
      return { accountId, adapter };
    }
  }

  if (candidates.length === 1) {
    const [accountId, adapter] = candidates[0];
    const expectedSecret = adapter.getConfig().webhookSecret;
    if (expectedSecret && providedSecret !== expectedSecret) {
      return null;
    }
    return { accountId, adapter };
  }

  return null;
}

function ensureWebhookRoute(webhookPath: string, log?: { info?: (...args: unknown[]) => void }): void {
  if (registeredWebhookPaths.has(webhookPath)) return;
  if (!pluginApi?.registerHttpRoute) {
    throw new Error('OpenClaw runtime does not support plugin HTTP routes');
  }

  pluginApi.registerHttpRoute({
    path: webhookPath,
    replaceExisting: true,
    handler: async (req: IncomingMessage, res: ServerResponse) => {
      await handleMaxWebhookRequest(req, res, webhookPath);
    },
  });
  registeredWebhookPaths.add(webhookPath);
  log?.info?.(`[MAX] Registered webhook route ${webhookPath}`);
}

async function handleMaxWebhookRequest(
  req: IncomingMessage,
  res: ServerResponse,
  webhookPath: string,
): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendTextResponse(res, 405, 'Method Not Allowed');
    return;
  }

  const contentType = getHeader(req, 'content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    sendTextResponse(res, 415, 'Unsupported Media Type');
    return;
  }

  const target = findWebhookTarget(req, webhookPath);
  if (!target) {
    sendTextResponse(res, 401, 'Unauthorized');
    return;
  }

  let body: unknown;
  try {
    body = await readJsonBody(req);
  } catch (err) {
    sendTextResponse(res, 400, err instanceof Error ? err.message : 'Invalid JSON');
    return;
  }

  if (!isMaxUpdate(body)) {
    sendTextResponse(res, 400, 'Invalid MAX update');
    return;
  }

  sendTextResponse(res, 200, 'OK');

  void target.adapter.handleWebhookUpdate(body).catch((err) => {
    console.error(`[MAX] Webhook processing failed for ${target.accountId}:`, err);
  });
}

async function maybeConfigureWebhookSubscription(
  account: MaxAccountConfig,
  accountId: string,
  log?: {
    info?: (...args: unknown[]) => void;
    warn?: (...args: unknown[]) => void;
    debug?: (...args: unknown[]) => void;
  },
): Promise<void> {
  if (account.autoSubscribe === false) {
    log?.info?.(`[MAX] Auto-subscribe disabled for ${accountId}`);
    return;
  }
  if (!account.webhookUrl) {
    log?.warn?.(
      `[MAX] No webhookUrl configured for ${accountId}; ` +
      'create the MAX subscription manually or add webhookUrl',
    );
    return;
  }
  if (account.webhookSecret && !/^[a-zA-Z0-9_-]{5,256}$/.test(account.webhookSecret)) {
    throw new Error('MAX webhookSecret must match /^[a-zA-Z0-9_-]{5,256}$/');
  }
  if (!account.webhookSecret) {
    log?.warn?.(`[MAX] webhookSecret is not configured for ${accountId}`);
  }

  const updateTypes = account.webhookUpdateTypes?.length
    ? account.webhookUpdateTypes
    : DEFAULT_WEBHOOK_UPDATE_TYPES;
  const client = {
    token: account.botToken,
  };

  const subscriptions = await getMaxSubscriptions(client);
  const existing = subscriptions.filter((sub) => sub.url === account.webhookUrl);
  if (existing.length) {
    log?.debug?.(`[MAX] Found ${existing.length} existing subscription(s) for ${account.webhookUrl}`);
  }

  await createMaxSubscription({
    ...client,
    url: account.webhookUrl,
    updateTypes,
    secret: account.webhookSecret,
  });
  log?.info?.(`[MAX] Webhook subscription configured for ${accountId}`);
}

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
        deliveryMode: { type: 'string', enum: ['webhook', 'polling'], default: 'webhook' },
        webhookUrl: { type: 'string' },
        webhookPath: { type: 'string', default: DEFAULT_WEBHOOK_PATH },
        webhookSecret: { type: 'string' },
        webhookUpdateTypes: { type: 'array', items: { type: 'string' } },
        autoSubscribe: { type: 'boolean', default: true },
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

      // Try nested accounts form first, then flat form.
      // Nested accounts inherit root MAX defaults such as webhookUrl/path.
      const root = channels?.max ?? {};
      const account = root.accounts?.[id] ?? {};
      const inheritedRoot = root.accounts
        ? Object.fromEntries(
          Object.entries(root).filter(([key]) => key !== 'accounts'),
        )
        : root;
      const resolvedAccount = root.accounts
        ? { ...inheritedRoot, ...account }
        : root;

      // Resolve token from config or env
      const botToken =
        resolvedAccount.botToken ??
        root.botToken ??
        process.env.MAX_BOT_TOKEN ??
        '';

      return { accountId: id, ...resolvedAccount, botToken };
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
            const safeText = btnResult.cleanText.trim() || 'Выберите вариант:';
            await adapter.sendText(chatId, safeText, {
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
      const deliveryMode = resolveDeliveryMode(account);
      const webhookPath = resolveWebhookPath(account);

      log?.info?.(`[MAX] startAccount called for ${accountId}`);

      ctx.setStatus({
        accountId,
        running: true,
        connected: false,
        deliveryMode,
        ...(deliveryMode === 'webhook' ? { webhookPath, webhookUrl: account.webhookUrl } : {}),
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
            deliveryMode,
            ...(deliveryMode === 'webhook' ? { webhookPath, webhookUrl: account.webhookUrl } : {}),
            lastConnectedAt: Date.now(),
            lastError: null,
          });
          log?.info?.(
            deliveryMode === 'webhook'
              ? '[MAX] Bot connected and ready for webhooks'
              : '[MAX] Bot connected and polling',
          );
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
                        const safeText = btnResult.cleanText.trim() || 'Выберите вариант:';
                        const chunks = chunkText(safeText, chunkLimit);
                        for (let i = 0; i < chunks.length - 1; i++) {
                          await adapter.sendText(targetChatId, chunks[i], {
                            format: 'markdown',
                          });
                        }
                        await adapter.sendText(
                          targetChatId,
                          chunks[chunks.length - 1],
                          {
                            format: 'markdown',
                            attachments: [btnResult.keyboard],
                          },
                        );
                        log?.info?.(`[MAX] Sent with inline keyboard (${safeText.length} chars)`);
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

      if (deliveryMode === 'webhook') {
        ensureWebhookRoute(webhookPath, log);
        log?.info?.('[MAX] Starting webhook adapter...');
        await adapter.startWebhook();
        try {
          await maybeConfigureWebhookSubscription(account, accountId, log);
        } catch (err) {
          const detail = formatError(err);
          log?.warn?.(`[MAX] Webhook auto-subscribe failed for ${accountId}: ${detail}`);
          ctx.setStatus({
            ...ctx.getStatus(),
            lastError: detail,
            lastErrorAt: Date.now(),
          });
        }
        log?.info?.('[MAX] Webhook adapter started');
      } else {
        log?.warn?.(
          '[MAX] Starting Long Polling fallback. MAX limits Long Polling to 2 RPS, ' +
          '30s timeout, 100 events per batch, and 24h event TTL.',
        );
        void adapter.startPolling().catch((err) => {
          log?.error?.(`[MAX] Polling adapter failed: ${formatError(err)}`);
          ctx.setStatus({
            ...ctx.getStatus(),
            lastError: formatError(err),
            lastErrorAt: Date.now(),
          });
        });
      }

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
    pluginApi = api;
    setRuntime(api.runtime);
    api.registerChannel({ plugin: maxPlugin });
  },
};

export default plugin;
