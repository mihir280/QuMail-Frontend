'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ReadEmail } from '@/components/ReadEmail';
import { getToken } from '@/lib/api';

type Props = { params: { emailId: string } };

export default function ReadEmailPage({ params }: Props) {
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
      <div className="flex justify-center py-16" role="status" aria-live="polite" aria-label="Loading message">
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
          <h1 className="text-2xl font-semibold text-white md:text-3xl">Message</h1>
          <p className="text-sm text-slate-400">Decrypted content for your selected email.</p>
        </div>
      </div>
      <ReadEmail emailId={params.emailId} />
    </div>
  );
}
