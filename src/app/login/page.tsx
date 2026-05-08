'use client';

import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { login, register } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode');
  const [mode, setMode] = useState<'login' | 'register'>(modeParam === 'register' ? 'register' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      if (mode === 'register') {
        const r = await register(email.trim(), password);
        setMessage(`Account created. User id: ${r.userId}. You can sign in now.`);
        setMode('login');
      } else {
        await login(email.trim(), password);
        router.push('/inbox');
        router.refresh();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-page mx-auto max-w-4xl">
      <button
        type="button"
        onClick={() => router.push('/')}
        className="mb-3 inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 transition hover:bg-white/10"
      >
        ← Back
      </button>
      <div className="grid items-center gap-6 rounded-3xl border border-white/10 bg-[#0a1224]/80 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:grid-cols-[1.1fr_1fr] md:p-6">
      <section className="hidden rounded-2xl border border-white/10 bg-gradient-to-b from-indigo-500/20 to-emerald-500/10 p-6 md:block">
        <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs text-slate-200">
          Secure Access
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-white">
          Welcome to
          <br />
          QuMail
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          A minimal, distraction-free email workspace for secure communication. Sign in or create an account to continue.
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0d1527]/90 px-6 py-7">
        <h2 className="text-2xl font-semibold text-white">{mode === 'register' ? 'Create account' : 'Sign in'}</h2>
        <p className="mt-1 text-sm text-slate-400">
          {mode === 'register'
            ? 'Register with your email and password.'
            : 'Use your account email to open your inbox.'}
        </p>

        <div className="mt-5 mb-4 flex rounded-xl border border-white/10 bg-white/5 p-1">
        <button
          type="button"
          className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
            mode === 'login'
              ? 'bg-white/15 text-white shadow-sm'
              : 'text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          type="button"
          className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
            mode === 'register'
              ? 'bg-white/15 text-white shadow-sm'
              : 'text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
          onClick={() => setMode('register')}
        >
          Register
        </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm text-slate-400">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className="ui-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm text-slate-400">
            Password {mode === 'register' && <span className="text-slate-500">(min 8)</span>}
          </label>
          <input
            id="password"
            type="password"
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            required
            minLength={mode === 'register' ? 8 : 1}
            className="ui-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        {message && (
          <div className="ui-success" aria-live="polite">
            {message}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="ui-button-primary w-full"
        >
          <span className="inline-flex items-center justify-center gap-2">
            {loading && (
              <span className="ui-dots-loader" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            )}
            {loading ? 'Please wait...' : mode === 'register' ? 'Create account' : 'Sign in'}
          </span>
        </button>

        <p className="text-center text-xs text-slate-500">
          {mode === 'register' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            className="text-slate-300 underline underline-offset-2 hover:text-white"
            onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
          >
            {mode === 'register' ? 'Sign in' : 'Register'}
          </button>
        </p>
        </form>
      </section>
      </div>
    </div>
  );
}
