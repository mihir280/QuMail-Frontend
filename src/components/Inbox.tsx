'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  getInbox,
  getSentEmails,
  getStarredEmailIds,
  toggleStarredEmailId,
  type InboxItem
} from '@/lib/api';

type Folder = 'inbox' | 'sent' | 'starred';

type Props = {
  folder?: Folder;
  searchQuery?: string;
};

type MailRow = {
  emailId: string;
  subject: string;
  contactLabel: string;
  contactValue: string;
  createdAt: string;
  status: string;
  href?: string;
};

function statusClass(status: string): string {
  switch (status) {
    case 'PendingSend':
      return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    case 'Sent':
      return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
    case 'Read':
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    default:
      return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  } catch {
    return iso;
  }
}

export function Inbox({ folder = 'inbox', searchQuery = '' }: Props) {
  const router = useRouter();
  const [emails, setEmails] = useState<MailRow[]>([]);
  const [starredIds, setStarredIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const starred = getStarredEmailIds();
        const { emails: inboxList } = await getInbox();
        const sentList = getSentEmails();

        const mappedInbox: MailRow[] = inboxList.map((row: InboxItem) => ({
          emailId: row.emailId,
          subject: row.subject,
          contactLabel: 'From',
          contactValue: row.senderId,
          createdAt: row.createdAt,
          status: row.status,
          href: `/read/${row.emailId}`
        }));
        const mappedSent: MailRow[] = sentList.map((row) => ({
          emailId: row.emailId,
          subject: row.subject,
          contactLabel: 'To',
          contactValue: row.to,
          createdAt: row.createdAt,
          status: 'Sent',
          href: `/read/sent/${row.emailId}`
        }));

        let selected = mappedInbox;
        if (folder === 'sent') {
          selected = mappedSent;
        } else if (folder === 'starred') {
          selected = [...mappedInbox, ...mappedSent].filter((row) => starred.includes(row.emailId));
        }

        if (!cancelled) {
          setEmails(selected);
          setStarredIds(starred);
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
  }, [folder]);

  const search = searchQuery.trim().toLowerCase();
  const filtered = emails.filter((row) => {
    if (!search) {
      return true;
    }
    return row.subject.toLowerCase().includes(search) || row.contactValue.toLowerCase().includes(search);
  });

  if (loading) {
    return (
      <div className="space-y-3 py-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="ui-card animate-pulse p-4">
            <div className="mb-3 h-4 w-2/5 rounded bg-slate-700/80" />
            <div className="mb-2 h-3 w-1/2 rounded bg-slate-700/60" />
            <div className="h-3 w-1/3 rounded bg-slate-800/80" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" aria-live="polite" className="ui-error px-4 py-3">
        <span className="mr-1 font-semibold" aria-hidden="true">
          !
        </span>
        {error}
      </div>
    );
  }

  if (filtered.length === 0) {
    return <p className="text-qumail-muted">No messages yet.</p>;
  }

  return (
    <ul className="space-y-2 rounded-2xl border border-white/10 bg-[#0b1222]/85 p-2">
      {filtered.map((row) => (
        <li key={row.emailId}>
          <div
            className={`rounded-xl border border-transparent bg-white/[0.03] p-4 transition hover:border-white/10 hover:bg-white/[0.06] ${
              row.href ? 'cursor-pointer' : ''
            }`}
            onClick={() => {
              if (row.href) {
                router.push(row.href);
              }
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-semibold text-white">{row.subject || '(no subject)'}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={starredIds.includes(row.emailId) ? 'Remove star' : 'Add star'}
                  className={`rounded-full px-2 py-0.5 text-xs transition ${
                    starredIds.includes(row.emailId)
                      ? 'bg-amber-400/20 text-amber-300'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                  }`}
                  onClick={(e) => {
                    // Keep star action independent from row click navigation.
                    e.stopPropagation();
                    const next = toggleStarredEmailId(row.emailId);
                    setStarredIds(next);
                    if (folder === 'starred') {
                      setEmails((current) => current.filter((item) => next.includes(item.emailId)));
                    }
                  }}
                >
                  ★
                </button>
                <span className={`rounded-full border px-2 py-0.5 text-xs ${statusClass(row.status)}`}>
                  {row.status}
                </span>
              </div>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {row.contactLabel} <span className="text-slate-300">{row.contactValue}</span>
            </p>
            <p className="mt-2 text-xs text-slate-500">{formatDate(row.createdAt)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
