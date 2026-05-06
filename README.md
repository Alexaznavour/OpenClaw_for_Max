# @openclaw/max

[English](#english) | [Русский](#русский)

---

## English

OpenClaw channel plugin for [MAX messenger](https://max.ru) — connect your AI agent to MAX with full support for text, voice messages, images, video, files, inline buttons, and more.

### Installation

```bash
openclaw plugins install @openclaw/max
```

Local development:

```bash
openclaw plugins install -l ./path/to/openclaw-max
```

#### Docker

```bash
# Inside the container (or via docker exec):
node /app/openclaw.mjs plugins install /path/to/openclaw-max

# Create symlink so the plugin can resolve openclaw imports:
ln -sf /app /home/node/.openclaw/extensions/max/node_modules/openclaw

# Restart the gateway:
docker restart <container-name>
```

> **Note:** The symlink is needed because `openclaw` lives in `/app/` while the plugin is installed under `/home/node/.openclaw/extensions/max/`. The `postinstall` script attempts to create it automatically, but in some Docker setups you may need to do it manually.

### Configuration

#### Flat config (single bot)

Add your bot token to `~/.openclaw/openclaw.json`:

```json
{
  "channels": {
    "max": {
      "enabled": true,
      "deliveryMode": "webhook",
      "botToken": "YOUR_BOT_TOKEN_HERE",
      "webhookUrl": "https://your-domain.com/webhook/max?accountId=default",
      "webhookSecret": "CHANGE_ME_12345",
      "dmPolicy": "open",
      "allowFrom": ["*"],
      "groups": {
        "*": { "requireMention": true }
      }
    }
  }
}
```

#### Multi-account config

```json
{
  "channels": {
    "max": {
      "enabled": true,
      "deliveryMode": "webhook",
      "webhookUrl": "https://your-domain.com/webhook/max",
      "accounts": {
        "default": { "botToken": "TOKEN_1", "webhookSecret": "SECRET_1" },
        "support": { "botToken": "TOKEN_2", "webhookSecret": "SECRET_2" }
      }
    }
  }
}
```

When multiple accounts share the same webhook path, either include `accountId` in each `webhookUrl` or configure a unique `webhookSecret` per account. Ambiguous webhook requests are rejected with `401`.

#### Environment variable

```bash
MAX_BOT_TOKEN="YOUR_BOT_TOKEN_HERE" openclaw gateway
```

#### Getting a bot token

1. Register on [MAX for partners](https://partners.max.ru)
2. Create a new bot in the **Chat bots** section
3. After moderation, go to **Integration** > **Get token**
4. Copy the token into your config and restart the gateway

#### Config reference

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `botToken` | Yes | — | Bot token from MAX partners platform |
| `enabled` | No | `true` | Enable/disable this channel |
| `deliveryMode` | No | `webhook` | Receive mode: `webhook` for production, `polling` only as an explicit local fallback |
| `webhookUrl` | Recommended | — | Public HTTPS URL registered with MAX, e.g. `https://your-domain.com/webhook/max?accountId=default` |
| `webhookPath` | No | `/webhook/max` | Local OpenClaw route path; inferred from `webhookUrl` when present |
| `webhookSecret` | Recommended | — | Shared secret sent by MAX in `X-Max-Bot-Api-Secret` (`5-256` chars, `A-Z`, `a-z`, `0-9`, `_`, `-`) |
| `webhookUpdateTypes` | No | `message_created`, `message_edited`, `message_callback`, `bot_started` | MAX update types to subscribe to |
| `autoSubscribe` | No | `true` | Automatically call `POST /subscriptions` on startup when `webhookUrl` is configured |
| `dmPolicy` | No | `open` | DM access: `open`, `allowlist`, `pairing`, `disabled` |
| `allowFrom` | No | `["*"]` | Allowed sender IDs (`["*"]` = everyone) |
| `groupPolicy` | No | `allowlist` | Group access: `open`, `allowlist`, `disabled` |
| `groups` | No | — | Per-group settings (`"*"` = all groups) |
| `requireMention` | No | `true` | Require @mention in groups |
| `mediaMaxMb` | No | `5` | Max inbound media download size (MB) |
| `textChunkLimit` | No | `4000` | Max chars per outbound message chunk |

### Inline buttons

The plugin converts special markup in agent responses into native MAX inline keyboards. The agent includes button markup directly in its text — the plugin strips it out and sends real buttons.

**Syntax:**

| Markup | Result |
|--------|--------|
| `<<Button>>` | Callback button (payload = button text) |
| `<<Button\|custom_data>>` | Callback button with custom payload |
| `<<Open site\|https://example.com>>` | Link button |

Multiple buttons on the same line form a single row. Each line of buttons is a separate row.

**Example agent response:**

```
Choose a color:
<<Red|red>> <<Green|green>> <<Blue|blue>>
<<Cancel|cancel>>
```

This sends the text "Choose a color:" with a 3-button first row and a 1-button second row.

If the button markup consumes all text, the message is sent with a default placeholder.

### Features

| Feature | Supported |
|---------|-----------|
| Text messages (send/receive) | Yes |
| Voice/audio messages (receive) | Yes (transcription via OpenClaw) |
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

### How it works

```
┌─────────────────┐      HTTPS Webhook        ┌─────────────────────┐
│  MAX Server      │ ──────────────────────── │  OpenClaw Gateway   │
│  (platform-api)  │      POST /webhook/max    │  + @openclaw/max    │
│                  │                           │                     │
└─────────────────┘                           └────────┬────────────┘
                                                       │
                                              OpenClaw Plugin API
                                                       │
                                              ┌────────▼────────────┐
                                              │  OpenClaw Gateway    │
                                              │  (agent runtime)     │
                                              └─────────────────────┘
```

1. Plugin registers a local OpenClaw HTTP route, defaulting to `/webhook/max`
2. On startup, it can call `POST https://platform-api.max.ru/subscriptions` with `webhookUrl`, `webhookUpdateTypes`, and `webhookSecret`
3. MAX sends each update as an HTTPS POST and includes `X-Max-Bot-Api-Secret` when a secret is configured
4. Incoming messages (text, voice, images) are normalized into OpenClaw format
5. Agent replies are sent back — text as markdown, media as uploaded attachments, buttons as inline keyboards

### Webhook requirements

MAX requires the public endpoint to be available over HTTPS on port 443 with a trusted TLS certificate and a complete certificate chain. The endpoint must return HTTP `200 OK` within 30 seconds. The plugin acknowledges valid webhook requests immediately and processes the update asynchronously through the existing OpenClaw pipeline.

You can also create the subscription manually:

```bash
curl -X POST "https://platform-api.max.ru/subscriptions" \
  -H "Authorization: YOUR_BOT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/webhook/max?accountId=default",
    "update_types": ["message_created", "message_edited", "message_callback", "bot_started"],
    "secret": "CHANGE_ME_12345"
  }'
```

### Long Polling fallback

Long Polling is now intended only for explicit local fallback:

```json
{
  "channels": {
    "max": {
      "deliveryMode": "polling",
      "botToken": "YOUR_BOT_TOKEN_HERE"
    }
  }
}
```

MAX limits Long Polling to 2 RPS, a 30-second request timeout, batches of up to 100 events, and 24-hour event TTL. Use webhook mode for production.

### Development

```bash
npm install
npm run build    # tsc -> esbuild bundle
npm test         # vitest
npm run dev      # tsc --watch
```

#### Project structure

```
src/
  index.ts       — Plugin entry, registers channel, OpenClaw pipeline
  adapter.ts     — MAX Bot client wrapper (Webhook receive + polling fallback)
  normalizer.ts  — Normalize MAX updates to OpenClaw message format
  media.ts       — Download inbound / upload outbound media files
  types.ts       — TypeScript type definitions
  runtime.ts     — OpenClaw runtime holder
```

### License

MIT

---

## Русский

Плагин канала OpenClaw для [мессенджера MAX](https://max.ru) — подключите вашего AI-агента к MAX с полной поддержкой текста, голосовых сообщений, изображений, видео, файлов, инлайн-кнопок и многого другого.

### Установка

```bash
openclaw plugins install @openclaw/max
```

Локальная разработка:

```bash
openclaw plugins install -l ./path/to/openclaw-max
```

#### Docker

```bash
# Внутри контейнера (или через docker exec):
node /app/openclaw.mjs plugins install /path/to/openclaw-max

# Создайте симлинк для резолва импортов openclaw:
ln -sf /app /home/node/.openclaw/extensions/max/node_modules/openclaw

# Перезапустите gateway:
docker restart <container-name>
```

> **Примечание:** Симлинк нужен потому что `openclaw` находится в `/app/`, а плагин устанавливается в `/home/node/.openclaw/extensions/max/`. Скрипт `postinstall` пытается создать его автоматически, но в некоторых Docker-конфигурациях может потребоваться сделать это вручную.

### Конфигурация

#### Простой конфиг (один бот)

Добавьте токен бота в `~/.openclaw/openclaw.json`:

```json
{
  "channels": {
    "max": {
      "enabled": true,
      "deliveryMode": "webhook",
      "botToken": "ВАШ_ТОКЕН_БОТА",
      "webhookUrl": "https://your-domain.com/webhook/max?accountId=default",
      "webhookSecret": "CHANGE_ME_12345",
      "dmPolicy": "open",
      "allowFrom": ["*"],
      "groups": {
        "*": { "requireMention": true }
      }
    }
  }
}
```

#### Мульти-аккаунт

```json
{
  "channels": {
    "max": {
      "enabled": true,
      "deliveryMode": "webhook",
      "webhookUrl": "https://your-domain.com/webhook/max",
      "accounts": {
        "default": { "botToken": "ТОКЕН_1", "webhookSecret": "SECRET_1" },
        "support": { "botToken": "ТОКЕН_2", "webhookSecret": "SECRET_2" }
      }
    }
  }
}
```

Если несколько аккаунтов используют один и тот же webhook path, добавьте `accountId` в каждый `webhookUrl` или задайте уникальный `webhookSecret` для каждого аккаунта. Неоднозначные webhook-запросы отклоняются с `401`.

#### Переменная окружения

```bash
MAX_BOT_TOKEN="ВАШ_ТОКЕН_БОТА" openclaw gateway
```

#### Получение токена бота

1. Зарегистрируйтесь на [MAX для партнёров](https://partners.max.ru)
2. Создайте нового бота в разделе **Чат-боты**
3. После модерации перейдите в **Интеграция** > **Получить токен**
4. Скопируйте токен в конфигурацию и перезапустите gateway

#### Справочник по конфигурации

| Поле | Обязательно | По умолчанию | Описание |
|------|-------------|--------------|----------|
| `botToken` | Да | — | Токен бота с платформы MAX для партнёров |
| `enabled` | Нет | `true` | Включить/выключить канал |
| `deliveryMode` | Нет | `webhook` | Режим получения событий: `webhook` для production, `polling` только как явный локальный fallback |
| `webhookUrl` | Рекомендуется | — | Публичный HTTPS URL, зарегистрированный в MAX, например `https://your-domain.com/webhook/max?accountId=default` |
| `webhookPath` | Нет | `/webhook/max` | Локальный route OpenClaw; если указан `webhookUrl`, путь берётся из него |
| `webhookSecret` | Рекомендуется | — | Общий секрет из заголовка `X-Max-Bot-Api-Secret` (`5-256` символов, `A-Z`, `a-z`, `0-9`, `_`, `-`) |
| `webhookUpdateTypes` | Нет | `message_created`, `message_edited`, `message_callback`, `bot_started` | Типы событий MAX для подписки |
| `autoSubscribe` | Нет | `true` | Автоматически вызвать `POST /subscriptions` при старте, если настроен `webhookUrl` |
| `dmPolicy` | Нет | `open` | Доступ к ЛС: `open`, `allowlist`, `pairing`, `disabled` |
| `allowFrom` | Нет | `["*"]` | Разрешённые ID отправителей (`["*"]` = все) |
| `groupPolicy` | Нет | `allowlist` | Доступ к группам: `open`, `allowlist`, `disabled` |
| `groups` | Нет | — | Настройки по группам (`"*"` = все группы) |
| `requireMention` | Нет | `true` | Требовать @упоминание в группах |
| `mediaMaxMb` | Нет | `5` | Макс. размер входящего медиа (МБ) |
| `textChunkLimit` | Нет | `4000` | Макс. символов в одном исходящем сообщении |

### Инлайн-кнопки

Плагин преобразует специальную разметку в ответах агента в нативные инлайн-клавиатуры MAX. Агент включает разметку кнопок прямо в текст — плагин вырезает её и отправляет настоящие кнопки.

**Синтаксис:**

| Разметка | Результат |
|----------|-----------|
| `<<Кнопка>>` | Callback-кнопка (payload = текст кнопки) |
| `<<Кнопка\|данные>>` | Callback-кнопка с кастомным payload |
| `<<Открыть сайт\|https://example.com>>` | Кнопка-ссылка |

Несколько кнопок на одной строке образуют один ряд. Каждая строка кнопок — отдельный ряд.

**Пример ответа агента:**

```
Выберите цвет:
<<Красный|red>> <<Зелёный|green>> <<Синий|blue>>
<<Отмена|cancel>>
```

Отправится текст "Выберите цвет:" с тремя кнопками в первом ряду и одной во втором.

Если разметка кнопок занимает весь текст, сообщение отправляется с текстом-заглушкой.

### Возможности

| Функция | Поддержка |
|---------|-----------|
| Текстовые сообщения (отправка/получение) | Да |
| Голосовые сообщения (получение) | Да (транскрипция через OpenClaw) |
| Изображения (отправка/получение) | Да |
| Видео (отправка/получение) | Да |
| Файлы (отправка/получение) | Да |
| Стикеры (получение) | Да |
| Инлайн-кнопки | Да |
| Цепочки ответов (reply) | Да |
| Форматирование Markdown | Да |
| Личные сообщения | Да |
| Групповые чаты | Да |
| Callback-кнопки | Да |

### Как это работает

```
┌─────────────────┐      HTTPS Webhook        ┌─────────────────────┐
│  Сервер MAX      │ ──────────────────────── │  OpenClaw Gateway   │
│  (platform-api)  │      POST /webhook/max    │  + @openclaw/max    │
│                  │                           │                     │
└─────────────────┘                           └────────┬────────────┘
                                                       │
                                              OpenClaw Plugin API
                                                       │
                                              ┌────────▼────────────┐
                                              │  OpenClaw Gateway    │
                                              │  (среда выполнения)  │
                                              └─────────────────────┘
```

1. Плагин регистрирует локальный HTTP route OpenClaw, по умолчанию `/webhook/max`
2. При старте он может вызвать `POST https://platform-api.max.ru/subscriptions` с `webhookUrl`, `webhookUpdateTypes` и `webhookSecret`
3. MAX отправляет каждое событие HTTPS POST-запросом и передаёт `X-Max-Bot-Api-Secret`, если задан секрет
4. Входящие сообщения (текст, голос, изображения) нормализуются в формат OpenClaw
5. Ответы агента отправляются обратно — текст в Markdown, медиа как вложения, кнопки как инлайн-клавиатуры

### Требования к Webhook

MAX требует, чтобы публичный endpoint был доступен по HTTPS на порту 443, с доверенным TLS-сертификатом и полной цепочкой сертификатов. Endpoint должен вернуть HTTP `200 OK` в течение 30 секунд. Плагин подтверждает валидные webhook-запросы сразу, а событие обрабатывает асинхронно через существующий пайплайн OpenClaw.

Подписку можно создать вручную:

```bash
curl -X POST "https://platform-api.max.ru/subscriptions" \
  -H "Authorization: ВАШ_ТОКЕН_БОТА" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/webhook/max?accountId=default",
    "update_types": ["message_created", "message_edited", "message_callback", "bot_started"],
    "secret": "CHANGE_ME_12345"
  }'
```

### Fallback на Long Polling

Long Polling теперь предназначен только для явного локального fallback:

```json
{
  "channels": {
    "max": {
      "deliveryMode": "polling",
      "botToken": "ВАШ_ТОКЕН_БОТА"
    }
  }
}
```

MAX ограничивает Long Polling: до 2 RPS, таймаут запроса 30 секунд, батч до 100 событий, TTL событий 24 часа. Для production используйте webhook-режим.

### Разработка

```bash
npm install
npm run build    # tsc -> esbuild бандл
npm test         # vitest
npm run dev      # tsc --watch
```

#### Структура проекта

```
src/
  index.ts       — Точка входа плагина, регистрация канала, пайплайн OpenClaw
  adapter.ts     — Обёртка MAX Bot API (Webhook + fallback на polling)
  normalizer.ts  — Нормализация обновлений MAX в формат OpenClaw
  media.ts       — Скачивание входящих / загрузка исходящих медиафайлов
  types.ts       — Определения типов TypeScript
  runtime.ts     — Хранилище runtime OpenClaw
```

### Лицензия

MIT
