import type { Metadata } from 'next';

import { AppFrame } from '@/components/AppFrame';

import './globals.css';

export const metadata: Metadata = {
  title: 'QuMail',
  description: 'QKD-integrated secure email (demo)'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
