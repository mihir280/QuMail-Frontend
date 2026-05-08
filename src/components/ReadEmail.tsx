'use client';

import { useEffect, useState } from 'react';

import { getEmail, type EmailDetail } from '@/lib/api';

type Props = { emailId: string };

export function ReadEmail({ emailId }: Props) {
  const [data, setData] = useState<EmailDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const d = await getEmail(emailId);
        if (!cancelled) {
          setData(d);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [emailId]);

  if (loading) {
    return (
      <div className="ui-card animate-pulse p-6">
        <div className="mb-4 h-6 w-1/2 rounded bg-slate-700/80" />
        <div className="mb-2 h-4 w-1/3 rounded bg-slate-700/60" />
        <div className="mb-6 h-3 w-1/4 rounded bg-slate-800/80" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-slate-700/60" />
          <div className="h-3 w-11/12 rounded bg-slate-700/60" />
          <div className="h-3 w-10/12 rounded bg-slate-700/60" />
          <div className="h-3 w-9/12 rounded bg-slate-700/60" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div role="alert" aria-live="polite" className="ui-error px-4 py-3">
        <span className="mr-1 font-semibold" aria-hidden="true">
          !
        </span>
        {error ?? 'Not found'}
      </div>
    );
  }

  return (
    <article className="rounded-2xl border border-white/10 bg-[#0d1527]/80 p-6">
      <h1 className="text-2xl font-semibold text-white">{data.subject}</h1>
      <p className="mt-2 text-sm text-slate-400">
        From <span className="text-slate-300">{data.from}</span>
      </p>
      <p className="mt-1 text-xs text-slate-500">{data.createdAt}</p>
      <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-200">{data.body}</pre>
    </article>
  );
}
