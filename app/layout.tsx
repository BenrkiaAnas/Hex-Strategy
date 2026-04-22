import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hex Arena · Multiplayer Strategy',
  description: '2.5D browser-based hex strategy game',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-hex-bg text-hex-text antialiased">
        {children}
      </body>
    </html>
  );
}
