# @openclaw/max

OpenClaw channel plugin for [MAX messenger](https://max.ru) — connect your AI agent to MAX with full support for text, voice messages, images, video, files, inline buttons, and more.

## Installation

```bash
openclaw plugins install @openclaw/max
```

For local development:

```bash
openclaw plugins install -l ./path/to/openclaw-max
```

### Docker Installation

```bash
# Inside the container (or via docker exec):
node /app/openclaw.mjs plugins install /path/to/openclaw-max

# Create symlink so the plugin can resolve openclaw imports:
ln -sf /app /home/node/.openclaw/extensions/max/node_modules/openclaw

# Restart the gateway:
docker restart <container-name>
```

> **Note:** The symlink is needed because `openclaw` lives in `/app/` (gateway root) while the plugin is installed under `/home/node/.openclaw/extensions/max/`. Node.js module resolution does not traverse from extensions into `/app` without this link. The `postinstall` script in `package.json` attempts to create it automatically, but in some Docker setups you may need to do it manually.

## Configuration

### Flat config (single bot, simple setup)

Add your bot token to `~/.openclaw/openclaw.json`:

```json
{
  "channels": {
    "max": {
      "enabled": true,
      "botToken": "YOUR_BOT_TOKEN_HERE",
      "dmPolicy": "open",
      "allowFrom": ["*"],
      "groups": {
        "*": { "requireMention": true }
      }
    }
  }
}
```

### Multi-account config

```json
{
  "channels": {
    "max": {
      "enabled": true,
      "accounts": {
        "default": {
          "botToken": "TOKEN_1"
        },
        "support": {
          "botToken": "TOKEN_2"
        }
      }
    }
  }
}
```

### Environment variable

```bash
MAX_BOT_TOKEN="YOUR_BOT_TOKEN_HERE" openclaw gateway
```

Then restart the gateway:

```bash
openclaw gateway restart
```

### Getting a bot token

1. Register on [MAX for partners](https://partners.max.ru)
2. Create a new bot in the **Chat bots** section
3. After moderation, go to **Integration** > **Get token**
4. Copy the token into your config

### Config reference

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `botToken` | Yes | — | Bot token from MAX partners platform |
| `enabled` | No | `true` | Enable/disable this channel |
| `dmPolicy` | No | `open` | DM access: `open`, `allowlist`, `pairing`, `disabled` |
| `allowFrom` | No | `["*"]` | Allowed sender IDs (use `["*"]` for everyone) |
| `groupPolicy` | No | `allowlist` | Group access: `open`, `allowlist`, `disabled` |
| `groups` | No | — | Per-group settings (use `"*"` for all groups) |
| `requireMention` | No | `true` | Require @mention in groups |
| `mediaMaxMb` | No | `5` | Max inbound media download size (MB) |
| `textChunkLimit` | No | `4000` | Max chars per outbound message chunk |

## Features

| Feature | Supported |
|---------|-----------|
| Text messages (send/receive) | Yes |
| Voice/audio messages (receive) | Yes (transcription via OpenClaw pipeline) |
| Images (send/receive) | Yes |
| Video (send/receive) | Yes |
| Files (send/receive) | Yes |
| Stickers (receive) | Yes |
| Inline buttons | Yes |
| Reply threading | Yes |
| Markdown formatting | Yes |
| Direct messages | Yes |
| Group chats | Yes |
| Callback buttons | Yes |

## How it works

```
┌─────────────────┐     Long Polling         ┌─────────────────────┐
│  MAX Server      │ ──────────────────────── │  @openclaw/max      │
│  (platform-api)  │     sendMessage /        │  (this plugin)      │
│                  │     upload + attach       │                     │
└─────────────────┘                           └────────┬────────────┘
                                                       │
                                              OpenClaw Plugin API
                                                       │
                                              ┌────────▼────────────┐
                                              │  OpenClaw Gateway    │
                                              │  (agent runtime)     │
                                              └─────────────────────┘
```

1. Plugin starts Long Polling via `@maxhub/max-bot-api`
2. Incoming messages (text, voice, images) are normalized into OpenClaw format
3. Voice/audio files are downloaded and passed to OpenClaw's transcription pipeline
4. Images are downloaded and passed to OpenClaw's vision pipeline
5. Agent replies are sent back — text as markdown, media as uploaded attachments

## Development

```bash
npm install
npm run build    # tsc -> esbuild bundle
npm test         # vitest
npm run dev      # tsc --watch
```

### Project structure

```
src/
  index.ts       — Plugin entry, registers channel, 5-step OpenClaw pipeline
  adapter.ts     — MAX Bot client wrapper (Long Polling lifecycle)
  normalizer.ts  — Normalize MAX updates to OpenClaw message format
  media.ts       — Download inbound / upload outbound media files
  types.ts       — TypeScript type definitions
  runtime.ts     — OpenClaw runtime holder
```

## License

MIT
