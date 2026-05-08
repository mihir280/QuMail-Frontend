import axios, { AxiosError } from 'axios';

const TOKEN_KEY = 'qumail_jwt';
const SENT_KEY = 'qumail_sent_items';
const STARRED_KEY = 'qumail_starred_ids';

export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function decodeTokenPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    if (!payload || typeof window === 'undefined') {
      return null;
    }
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getCurrentUserEmail(): string | null {
  const token = getToken();
  if (!token) {
    return null;
  }
  const payload = decodeTokenPayload(token);
  const email = payload?.emailAddress ?? payload?.email ?? payload?.sub;
  return typeof email === 'string' ? email : null;
}

const base = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');

export const api = axios.create({
  baseURL: base || undefined,
  headers: { 'Content-Type': 'application/json' },
  validateStatus: (s) => s >= 200 && s < 300
});

api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

function errMessage(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const ax = e as AxiosError<{ message?: string }>;
    const m = ax.response?.data?.message;
    if (typeof m === 'string') {
      return m;
    }
    return ax.message || 'Request failed';
  }
  if (e instanceof Error) {
    return e.message;
  }
  return 'Unknown error';
}

async function unwrap<T>(p: Promise<{ data: T }>): Promise<T> {
  try {
    const { data } = await p;
    return data;
  } catch (e) {
    throw new Error(errMessage(e));
  }
}

export async function register(email: string, password: string): Promise<{ userId: string }> {
  return unwrap(api.post('/auth/register', { emailAddress: email, password }));
}

export async function login(email: string, password: string): Promise<{ token: string; tokenType?: string }> {
  const data = await unwrap(api.post<{ token: string; tokenType?: string }>('/auth/login', {
    emailAddress: email,
    password
  }));
  setToken(data.token);
  return data;
}

export function logout(): void {
  clearToken();
}

export type SentEmailItem = {
  emailId: string;
  to: string;
  subject: string;
  body: string;
  createdAt: string;
  status: string;
};

function safeReadLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWriteLocal<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore write failures (private mode/storage limits)
  }
}

export async function sendEmail(
  to: string,
  subject: string,
  body: string
): Promise<{ emailId: string; status: string }> {
  return unwrap(api.post('/send-email', { to, subject, body }));
}

export function recordSentEmail(item: SentEmailItem): void {
  const existing = safeReadLocal<SentEmailItem[]>(SENT_KEY, []);
  safeWriteLocal(SENT_KEY, [item, ...existing]);
}

export function getSentEmails(): SentEmailItem[] {
  return safeReadLocal<SentEmailItem[]>(SENT_KEY, []);
}

export function getSentEmailById(emailId: string): SentEmailItem | null {
  return getSentEmails().find((item) => item.emailId === emailId) ?? null;
}

export function getStarredEmailIds(): string[] {
  return safeReadLocal<string[]>(STARRED_KEY, []);
}

export function toggleStarredEmailId(emailId: string): string[] {
  const existing = getStarredEmailIds();
  const has = existing.includes(emailId);
  const next = has ? existing.filter((id) => id !== emailId) : [emailId, ...existing];
  safeWriteLocal(STARRED_KEY, next);
  return next;
}

export type InboxItem = {
  emailId: string;
  subject: string;
  senderId: string;
  createdAt: string;
  status: string;
};

export async function getInbox(): Promise<{ emails: InboxItem[] }> {
  return unwrap(api.get('/inbox'));
}

export type EmailDetail = {
  emailId: string;
  subject: string;
  from: string;
  body: string;
  createdAt: string;
};

export async function getEmail(emailId: string): Promise<EmailDetail> {
  return unwrap(api.get(`/email/${encodeURIComponent(emailId)}`));
}
