import Link from 'next/link';

interface DashboardPlaceholderProps {
  titre: string;
  description: string;
  sections: string[];
}

// Shared template for the role screens. The final screens will replace these
// placeholders as the implementation progresses.
export function DashboardPlaceholder({
  titre,
  description,
  sections,
}: DashboardPlaceholderProps) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/" className="text-sm text-marque-accent">
        {"Retour à l'accueil"}
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">{titre}</h1>
      <p className="mt-2 text-gray-600">{description}</p>

      <ul className="mt-6 space-y-2">
        {sections.map((section) => (
          <li
            key={section}
            className="rounded-md border border-dashed border-gray-300 bg-white px-4 py-3 text-sm text-gray-700"
          >
            {section}
            <span className="ml-2 text-xs text-gray-400">(à venir)</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
