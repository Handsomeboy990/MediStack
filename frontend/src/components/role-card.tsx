import Link from 'next/link';
import { RoleDefinition } from '@/lib/roles';

export function RoleCard({ role }: { role: RoleDefinition }) {
  return (
    <Link
      href={`/${role.slug}`}
      className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-marque-accent hover:shadow"
    >
      <h2 className="text-lg font-semibold text-gray-900">{role.nom}</h2>
      <p className="mt-2 text-sm text-gray-600">{role.description}</p>
    </Link>
  );
}
