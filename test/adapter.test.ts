import { describe, expect, it } from 'vitest';
import { MaxAdapter } from '../src/adapter.js';
import type { MaxUpdate, MessageEnvelope } from '../src/types.js';

function messageUpdate(updateType = 'message_created'): MaxUpdate {
  return {
    update_type: updateType,
    timestamp: 1_700_000_000_000,
    message: {
      sender: {
        user_id: 42,
        name: 'Alex',
        username: 'alex',
      },
      recipient: {
        chat_id: 99,
        chat_type: 'dialog',
      },
      body: {
        mid: 'mid-1',
        text: 'hello from webhook',
      },
      timestamp: 1_700_000_000_000,
    },
  };
}

describe('MaxAdapter webhook updates', () => {
  it('normalizes webhook message updates through the shared pipeline', async () => {
    const envelopes: MessageEnvelope[] = [];
    const adapter = new MaxAdapter({
      config: { botToken: 'token' },
      onMessage: async (envelope) => {
        envelopes.push(envelope);
      },
    });

    await adapter.handleWebhookUpdate(messageUpdate());

    expect(envelopes).toHaveLength(1);
    expect(envelopes[0]).toMatchObject({
      id: 'mid-1',
      channelId: 'max',
      chatType: 'direct',
      chatId: 99,
      sender: {
        id: '42',
        name: 'Alex',
        username: 'alex',
      },
      content: {
        text: 'hello from webhook',
      },
    });
  });

  it('deduplicates repeated webhook deliveries by update type and message id', async () => {
    const envelopes: MessageEnvelope[] = [];
    const adapter = new MaxAdapter({
      config: { botToken: 'token' },
      onMessage: async (envelope) => {
        envelopes.push(envelope);
      },
    });
    const update = messageUpdate();

    await adapter.handleWebhookUpdate(update);
    await adapter.handleWebhookUpdate(update);

    expect(envelopes).toHaveLength(1);
  });

  it('marks edited webhook messages in metadata', async () => {
    const envelopes: MessageEnvelope[] = [];
    const adapter = new MaxAdapter({
      config: { botToken: 'token' },
      onMessage: async (envelope) => {
        envelopes.push(envelope);
      },
    });

    await adapter.handleWebhookUpdate(messageUpdate('message_edited'));

    expect(envelopes).toHaveLength(1);
    expect(envelopes[0].metadata.edited).toBe(true);
  });
});
