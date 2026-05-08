'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Inbox } from '@/components/Inbox';
import { getToken } from '@/lib/api';

export default function StarredPage() {
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
      <div className="flex justify-center py-16" role="status" aria-live="polite" aria-label="Loading starred messages">
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
          <h1 className="text-2xl font-semibold text-white md:text-3xl">Starred</h1>
          <p className="text-sm text-slate-400">Messages marked important.</p>
        </div>
      </div>
      <Inbox folder="starred" searchQuery={q} />
    </div>
  );
}
