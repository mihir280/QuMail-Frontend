import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="animate-page space-y-8">
      <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#090f1d]/85 px-6 py-16 text-center shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl md:px-10 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(16,185,129,0.16),transparent_40%),radial-gradient(circle_at_20%_25%,rgba(99,102,241,0.22),transparent_42%)]" />
        <div className="relative mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-slate-300">
            <span className="text-violet-300">✦</span>
            New - Quiet Mode for focused mornings
          </div>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white md:text-6xl">
            Email that feels calm,
            <br />
            not crowded.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
            QuMail is a beautifully minimal inbox for people who want to focus on what matters, without the noise.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/login" className="rounded-full bg-violet-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:brightness-105">
              Log in
            </Link>
            <Link href="/login?mode=register" className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Register
            </Link>
          </div>
          <p className="mt-3 text-xs text-slate-500">No credit card required. Free for 30 days.</p>
        </div>
      </section>

      <section id="features" className="grid gap-3 rounded-2xl border border-white/10 bg-[#0b1222]/80 p-6 md:grid-cols-3">
        <article className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-base font-semibold text-white">Quantum-safe security</h2>
          <p className="mt-2 text-sm text-slate-300">QKD-inspired secure workflow with token-based access for authenticated users.</p>
        </article>
        <article className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-base font-semibold text-white">Minimal inbox design</h2>
          <p className="mt-2 text-sm text-slate-300">A clean interface that helps users read, compose, and focus without clutter.</p>
        </article>
        <article className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-base font-semibold text-white">Fast API integration</h2>
          <p className="mt-2 text-sm text-slate-300">Seamless frontend flow connected to your existing backend endpoints.</p>
        </article>
      </section>

      <section id="customers" className="rounded-2xl border border-white/10 bg-[#0b1222]/80 p-6">
        <h2 className="text-xl font-semibold text-white">Customers</h2>
        <p className="mt-2 text-sm text-slate-300">
          Built for students, teams, and professionals who want secure and distraction-free communication.
        </p>
      </section>

      <section id="about" className="rounded-2xl border border-white/10 bg-[#0b1222]/80 p-6">
        <h2 className="text-xl font-semibold text-white">About</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          QuMail is our capstone project focused on secure messaging with a modern user experience. The project combines
          a robust backend API and a responsive Next.js frontend to demonstrate login, inbox, compose, and message-read flows
          in a polished product-style interface.
        </p>
      </section>
    </div>
  );
}
