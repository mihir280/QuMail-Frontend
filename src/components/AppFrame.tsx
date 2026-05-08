'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { getCurrentUserEmail, getToken, logout } from '@/lib/api';

type Props = {
  children: React.ReactNode;
};

const APP_ROUTES = ['/inbox', '/compose', '/read', '/sent', '/starred'];

function isAppRoute(pathname: string): boolean {
  return APP_ROUTES.some((route) => pathname.startsWith(route));
}

export function AppFrame({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [authed, setAuthed] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('Guest');
  const [searchText, setSearchText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setAuthed(Boolean(getToken()));
    setUserEmail(getCurrentUserEmail() ?? 'Guest');
    setMenuOpen(false);
  }, [pathname]);

  const appRoute = useMemo(() => isAppRoute(pathname), [pathname]);
  const activeQuery = searchParams.get('q') ?? '';

  useEffect(() => {
    setSearchText(activeQuery);
  }, [activeQuery]);

  const goToRouteWithSearch = (route: string) => {
    const query = searchText.trim();
    router.push(query ? `${route}?q=${encodeURIComponent(query)}` : route);
  };

  if (appRoute) {
    return (
      <div className="mx-auto w-full max-w-[1400px] p-4 md:p-5">
        <div className="min-h-[calc(100vh-2rem)] overflow-hidden rounded-[28px] border border-white/10 bg-[#090f1d]/90 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <div className="grid min-h-[calc(100vh-2rem)] grid-cols-1 lg:grid-cols-[240px_1fr]">
            <aside className="border-b border-white/10 bg-[#0a1121]/95 p-4 lg:border-b-0 lg:border-r">
              <Link href="/inbox" className="mb-5 inline-flex items-center gap-2 text-lg font-semibold text-white">
                <span className="inline-block h-2 w-2 rounded-full bg-violet-300" />
                QuMail
              </Link>
              <Link
                href="/compose"
                className="mb-4 block rounded-xl bg-gradient-to-r from-violet-400 to-indigo-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-900 transition hover:brightness-105"
              >
                + Compose
              </Link>
              <nav className="space-y-1 text-sm text-slate-300">
                <button
                  type="button"
                  onClick={() => goToRouteWithSearch('/inbox')}
                  className={`block w-full rounded-lg px-3 py-2 text-left transition ${pathname.startsWith('/inbox') ? 'bg-emerald-400/20 text-emerald-200' : 'hover:bg-white/5 hover:text-white'}`}
                >
                  Inbox
                </button>
                <button
                  type="button"
                  onClick={() => goToRouteWithSearch('/sent')}
                  className={`block w-full rounded-lg px-3 py-2 text-left transition ${pathname.startsWith('/sent') ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'}`}
                >
                  Sent
                </button>
                <button
                  type="button"
                  onClick={() => goToRouteWithSearch('/starred')}
                  className={`block w-full rounded-lg px-3 py-2 text-left transition ${pathname.startsWith('/starred') ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'}`}
                >
                  Starred
                </button>
              </nav>
            </aside>
            <section className="bg-[#070d19]/80">
              <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-6">
                <form
                  className="hidden w-full max-w-xl md:block"
                  onSubmit={(e) => {
                    e.preventDefault();
                    goToRouteWithSearch(pathname.startsWith('/compose') ? '/inbox' : pathname);
                  }}
                >
                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search by subject or email..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-indigo-300/70 focus:ring-2 focus:ring-indigo-300/30"
                  />
                </form>
                <div className="relative ml-auto">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300"
                    onClick={() => setMenuOpen((value) => !value)}
                  >
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-300/20 text-violet-200">
                      {(userEmail[0] ?? 'U').toUpperCase()}
                    </span>
                    {authed ? userEmail : 'Guest'}
                  </button>
                  {menuOpen && authed && (
                    <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-white/10 bg-[#111b30] p-1 shadow-lg">
                      <button
                        type="button"
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/10"
                        onClick={() => {
                          logout();
                          setAuthed(false);
                          setMenuOpen(false);
                          router.push('/login');
                        }}
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </header>
              <main className="h-[calc(100%-58px)] overflow-auto p-4 md:p-6">{children}</main>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="border-b border-white/10 bg-black/20">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-semibold text-white">
            QuMail
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#customers" className="transition hover:text-white">
              Customers
            </a>
            <a href="#about" className="transition hover:text-white">
              About
            </a>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">{children}</main>
    </>
  );
}
