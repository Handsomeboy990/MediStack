import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
