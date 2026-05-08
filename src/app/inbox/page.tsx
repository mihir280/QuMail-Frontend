'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Inbox } from '@/components/Inbox';
import { getToken } from '@/lib/api';

export default function InboxPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const q = searchParams.get('q') ?? '';

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex justify-center py-16" role="status" aria-live="polite" aria-label="Loading inbox">
        <div className="ui-dots-loader" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-page space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white md:text-3xl">Inbox</h1>
          <p className="text-sm text-slate-400">10 conversations - 3 unread</p>
        </div>
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-300">
          Synced with QuMail API
        </span>
      </div>
      <Inbox folder="inbox" searchQuery={q} />
    </div>
  );
}
