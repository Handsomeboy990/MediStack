import Link from 'next/link';

// Login screen (placeholder). The authentication logic will be wired to
// POST /api/v1/auth/login through the centralized HTTP client.
export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
      <p className="mt-2 text-sm text-gray-600">
        Accédez à votre espace MediTrust.
      </p>

      <form className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            disabled
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="agent@centre.bj"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            type="password"
            disabled
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <button
          type="button"
          disabled
          className="w-full rounded-md bg-marque-accent px-4 py-2 text-white opacity-60"
        >
          Se connecter (à venir)
        </button>
      </form>

      <Link href="/" className="mt-6 text-sm text-marque-accent">
        {"Retour à l'accueil"}
      </Link>
    </main>
  );
}
