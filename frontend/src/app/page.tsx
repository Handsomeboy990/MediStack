import { ROLES } from '@/lib/roles';
import { RoleCard } from '@/components/role-card';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-10">
        <p className="text-sm font-medium text-marque-accent">MediTrust</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Gestion de caisse et de stock
        </h1>
        <p className="mt-2 text-gray-600">
          Choisissez un espace de travail selon votre rôle.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {ROLES.map((role) => (
          <RoleCard key={role.slug} role={role} />
        ))}
      </section>
    </main>
  );
}
