'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getToken, logout } from '@/lib/api';

export function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(!!getToken());
  }, [pathname]);

  return (
    <header className="border-b border-slate-800 bg-qumail-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link
          href={authed ? '/inbox' : '/'}
          className="rounded-md text-lg font-semibold tracking-tight text-white transition hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qumail-accent/70"
        >
          QuMail
        </Link>
        <nav className="flex gap-4 text-sm text-qumail-muted">
          {authed ? (
            <>
              <Link
                href="/inbox"
                className="rounded-md px-1.5 py-1 transition hover:text-white hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qumail-accent/70"
              >
                Inbox
              </Link>
              <Link
                href="/compose"
                className="rounded-md px-1.5 py-1 transition hover:text-white hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qumail-accent/70"
              >
                Compose
              </Link>
              <button
                type="button"
                className="rounded-md px-1.5 py-1 transition hover:text-white hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qumail-accent/70"
                onClick={() => {
                  logout();
                  setAuthed(false);
                  router.push('/login');
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qumail-accent/70"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
