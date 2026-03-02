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

#### Multi-account config

```json
{
  "channels": {
    "max": {
      "enabled": true,
      "accounts": {
        "default": { "botToken": "TOKEN_1" },
        "support": { "botToken": "TOKEN_2" }
      }
    }
  }
}
```

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
5. Agent replies are sent back — text as markdown, media as uploaded attachments, buttons as inline keyboards

### Auto-reconnect

The adapter runs a supervised polling loop. On network errors or API failures, it automatically reconnects with exponential backoff (1 s, 2 s, 5 s, 10 s, 30 s max). No manual gateway restart is needed — the plugin recovers on its own. Detailed logs are emitted for every reconnect attempt:

```
[MAX] Polling failed (attempt #1, last ok: 2026-03-02T18:24:08Z): Error: connect ETIMEDOUT ...
[MAX] Reconnecting in 1s...
[MAX] Connected as @botname
[MAX] Polling resumed after 1 reconnect attempt(s)
```

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
  adapter.ts     — MAX Bot client wrapper (Long Polling + auto-reconnect)
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
      "botToken": "ВАШ_ТОКЕН_БОТА",
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
      "accounts": {
        "default": { "botToken": "ТОКЕН_1" },
        "support": { "botToken": "ТОКЕН_2" }
      }
    }
  }
}
```

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
┌─────────────────┐     Long Polling         ┌─────────────────────┐
│  Сервер MAX      │ ──────────────────────── │  @openclaw/max      │
│  (platform-api)  │     sendMessage /        │  (этот плагин)      │
│                  │     upload + attach       │                     │
└─────────────────┘                           └────────┬────────────┘
                                                       │
                                              OpenClaw Plugin API
                                                       │
                                              ┌────────▼────────────┐
                                              │  OpenClaw Gateway    │
                                              │  (среда выполнения)  │
                                              └─────────────────────┘
```

1. Плагин запускает Long Polling через `@maxhub/max-bot-api`
2. Входящие сообщения (текст, голос, изображения) нормализуются в формат OpenClaw
3. Голосовые/аудио файлы скачиваются и передаются в пайплайн транскрипции OpenClaw
4. Изображения скачиваются и передаются в пайплайн обработки изображений OpenClaw
5. Ответы агента отправляются обратно — текст в Markdown, медиа как вложения, кнопки как инлайн-клавиатуры

### Автоматическое переподключение

Адаптер работает в supervised-цикле поллинга. При сетевых ошибках или сбоях API он автоматически переподключается с экспоненциальным backoff (1 с, 2 с, 5 с, 10 с, макс. 30 с). Ручной перезапуск gateway не требуется — плагин восстанавливается самостоятельно. Подробные логи выводятся при каждой попытке:

```
[MAX] Polling failed (attempt #1, last ok: 2026-03-02T18:24:08Z): Error: connect ETIMEDOUT ...
[MAX] Reconnecting in 1s...
[MAX] Connected as @botname
[MAX] Polling resumed after 1 reconnect attempt(s)
```

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
  adapter.ts     — Обёртка MAX Bot API (Long Polling + автопереподключение)
  normalizer.ts  — Нормализация обновлений MAX в формат OpenClaw
  media.ts       — Скачивание входящих / загрузка исходящих медиафайлов
  types.ts       — Определения типов TypeScript
  runtime.ts     — Хранилище runtime OpenClaw
```

### Лицензия

MIT
