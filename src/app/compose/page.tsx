'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ComposeEmail } from '@/components/ComposeEmail';
import { getToken } from '@/lib/api';

export default function ComposePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex justify-center py-16" role="status" aria-live="polite" aria-label="Loading compose screen">
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
          <h1 className="text-2xl font-semibold text-white md:text-3xl">Compose</h1>
          <p className="text-sm text-slate-400">Write a clean message and send securely.</p>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#0d1527]/80 p-5 md:p-6">
        <ComposeEmail />
      </div>
    </div>
  );
}
