'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getSentEmailById, getToken, type SentEmailItem } from '@/lib/api';

export const dynamic = 'force-dynamic';

type Props = { params: { emailId: string } };

export default function ReadSentEmailPage({ params }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<SentEmailItem | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    setEmail(getSentEmailById(params.emailId));
    setReady(true);
  }, [params.emailId, router]);

  if (!ready) {
    return (
      <div className="flex justify-center py-16" role="status" aria-live="polite" aria-label="Loading sent message">
        <div className="ui-dots-loader" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="ui-error" role="alert" aria-live="polite">
        Sent email not found.
      </div>
    );
  }

  return (
    <div className="animate-page space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white md:text-3xl">Sent Message</h1>
          <p className="text-sm text-slate-400">Subject and body of the message you sent.</p>
        </div>
      </div>
      <article className="rounded-2xl border border-white/10 bg-[#0d1527]/80 p-6">
        <h2 className="text-2xl font-semibold text-white">{email.subject || '(no subject)'}</h2>
        <p className="mt-2 text-sm text-slate-400">
          To <span className="text-slate-300">{email.to}</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">{new Date(email.createdAt).toLocaleString()}</p>
        <hr className="my-5 border-white/10" />
        <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-200">{email.body}</pre>
      </article>
    </div>
  );
}
