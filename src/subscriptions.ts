const DEFAULT_MAX_API_BASE_URL = 'https://platform-api.max.ru';

export interface MaxSubscription {
  url?: string;
  update_types?: string[];
  [key: string]: unknown;
}

export interface MaxSubscriptionResult {
  success?: boolean;
  message?: string;
  subscriptions?: MaxSubscription[];
  [key: string]: unknown;
}

export interface MaxSubscriptionClientOptions {
  token: string;
  baseUrl?: string;
}

export interface CreateSubscriptionOptions extends MaxSubscriptionClientOptions {
  url: string;
  updateTypes?: string[];
  secret?: string;
}

export interface DeleteSubscriptionOptions extends MaxSubscriptionClientOptions {
  url: string;
}

function buildHeaders(token: string): HeadersInit {
  return {
    Authorization: token,
    'Content-Type': 'application/json',
  };
}

function buildUrl(baseUrl: string | undefined, path: string): string {
  const root = baseUrl ?? DEFAULT_MAX_API_BASE_URL;
  return `${root.replace(/\/+$/, '')}${path}`;
}

async function parseResult(resp: Response): Promise<MaxSubscriptionResult> {
  const text = await resp.text();
  const body = text ? JSON.parse(text) as MaxSubscriptionResult : {};

  if (!resp.ok || body.success === false) {
    const message = body.message ?? `${resp.status} ${resp.statusText}`;
    throw new Error(`MAX subscriptions API error: ${message}`);
  }

  return body;
}

export async function getMaxSubscriptions(
  opts: MaxSubscriptionClientOptions,
): Promise<MaxSubscription[]> {
  const resp = await fetch(buildUrl(opts.baseUrl, '/subscriptions'), {
    method: 'GET',
    headers: buildHeaders(opts.token),
  });
  const result = await parseResult(resp);
  return result.subscriptions ?? [];
}

export async function createMaxSubscription(
  opts: CreateSubscriptionOptions,
): Promise<MaxSubscriptionResult> {
  const body: Record<string, unknown> = {
    url: opts.url,
  };
  if (opts.updateTypes?.length) {
    body.update_types = opts.updateTypes;
  }
  if (opts.secret) {
    body.secret = opts.secret;
  }

  const resp = await fetch(buildUrl(opts.baseUrl, '/subscriptions'), {
    method: 'POST',
    headers: buildHeaders(opts.token),
    body: JSON.stringify(body),
  });
  return parseResult(resp);
}

export async function deleteMaxSubscription(
  opts: DeleteSubscriptionOptions,
): Promise<MaxSubscriptionResult> {
  const url = new URL(buildUrl(opts.baseUrl, '/subscriptions'));
  url.searchParams.set('url', opts.url);

  const resp = await fetch(url, {
    method: 'DELETE',
    headers: buildHeaders(opts.token),
  });
  return parseResult(resp);
}
