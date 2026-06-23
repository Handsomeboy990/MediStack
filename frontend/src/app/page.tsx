import Image from 'next/image';
import { ArrowRight, ShieldCheck, TrendingUp, Users } from 'lucide-react';

import { ROLES } from '@/lib/roles';
import { RoleCard } from '@/components/role-card';

export default function HomePage() {
  return (
    <main className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(85,186,179,0.18),_transparent_35%),linear-gradient(180deg,_#f8fbfa_0%,_#ffffff_55%,_#f6f8f7_100%)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
      </div>

      <section className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-16">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-primary/10 bg-white/85 px-4 py-2 shadow-sm backdrop-blur">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary/10">
              <Image src="/logo-icone.png" alt="MediTrace" width={32} height={32} className="h-full w-full object-contain" priority />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">MediTrace</p>
              <p className="text-xs text-slate-500">Gestion clinique unifiée</p>
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary/70">Accueil</p>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Une interface claire pour la caisse, le stock et le suivi clinique.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              MediTrace rassemble la facturation, les patients, le stock et les rôles métiers dans une expérience rapide,
              lisible et prête pour le terrain.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Accéder à l’application
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#roles"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary/20 hover:text-primary"
            >
              Voir les espaces
            </a>
          </div>

          
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-primary/5 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-2xl shadow-slate-200/70">
            <div className="relative h-[32rem] w-full sm:h-[38rem]">
              <Image
                src="/image.jpeg"
                alt="Accueil MediTrace"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 space-y-3 p-6 text-white">
                {/* <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] backdrop-blur">
                  <Image src="/logo-icone.png" alt="MediTrace" width={18} height={18} className="h-4 w-4 object-contain" />
                  Vue d’ensemble
                </div> */}
                <h2 className="text-2xl font-bold sm:text-3xl">Tout le centre de santé, dans une seule interface.</h2>
                <p className="max-w-lg text-sm leading-6 text-white/85 sm:text-base">
                  Une base visuelle forte pour le portail d’accueil et les espaces métiers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="roles" className="relative mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/70">Espaces</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">Choisissez votre rôle</h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {ROLES.map((role) => (
            <RoleCard key={role.slug} role={role} />
          ))}
        </div>
      </section>
    </main>
  );
}
