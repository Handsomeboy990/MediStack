import type { Metadata } from 'next';
import { AppShell } from '@/components/app-sidebar';
import './globals.css';

export const metadata: Metadata = {
  title: 'MediTrace',
  description: 'Gestion de caisse, de facturation et de stock pour les centres de santé',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
