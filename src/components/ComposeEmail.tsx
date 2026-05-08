'use client';

import { useState } from 'react';

import { recordSentEmail, sendEmail } from '@/lib/api';

export function ComposeEmail() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const trimmedTo = to.trim();
      const res = await sendEmail(trimmedTo, subject, body);
      recordSentEmail({
        emailId: res.emailId,
        to: trimmedTo,
        subject,
        body,
        createdAt: new Date().toISOString(),
        status: res.status
      });
      setSuccess(`Sent — email id: ${res.emailId}`);
      setBody('');
      setSubject('');
      setTo('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="to" className="mb-1 block text-sm text-qumail-muted">
          To
        </label>
        <input
          id="to"
          type="email"
          required
          autoComplete="email"
          className="ui-input"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="subject" className="mb-1 block text-sm text-qumail-muted">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          required
          className="ui-input"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="body" className="mb-1 block text-sm text-qumail-muted">
          Body
        </label>
        <textarea
          id="body"
          required
          minLength={1}
          rows={8}
          className="ui-input w-full resize-y"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      {error && (
        <div role="alert" aria-live="polite" className="ui-error">
          <span className="mr-1 font-semibold" aria-hidden="true">
            !
          </span>
          {error}
        </div>
      )}
      {success && (
        <div className="ui-success" aria-live="polite">
          {success}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="ui-button-primary"
      >
        <span className="inline-flex items-center justify-center gap-2">
          {loading && (
            <span className="ui-dots-loader" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          )}
          {loading ? 'Sending...' : 'Send'}
        </span>
      </button>
    </form>
  );
}
