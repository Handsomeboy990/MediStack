import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { AppShell } from '@/components/app-sidebar';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'MediTrust',
  description: 'Gestion de caisse, de facturation et de stock pour les centres de santé',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={montserrat.variable}>
      <body className="bg-background text-foreground">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
