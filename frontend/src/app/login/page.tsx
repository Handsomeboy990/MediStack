'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Panneau gauche - identité visuelle */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 lg:flex lg:w-[45%]">
        {/* Motif décoratif */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-white/5" />
          <div className="absolute -bottom-24 -right-12 h-96 w-96 rounded-full bg-white/5" />
          <div className="absolute bottom-48 left-8 h-40 w-40 rounded-full bg-white/5" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-44 items-center justify-center overflow-hidden rounded-2xl bg-white/20 px-3">
            <Image
              src="/logo.png"
              alt="MediTrace"
              width={220}
              height={72}
              className="h-8 w-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Accroche centrale */}
        <div className="relative space-y-6">
          <div className="h-1 w-12 rounded bg-white/40" />
          <h1 className="text-4xl font-bold leading-tight text-white">
            La gestion<br />médicale,<br />simplifiée.
          </h1>
          <p className="text-base text-white/70 leading-relaxed max-w-xs">
            Facturation avec couverture assurance, stock centralisé et traçabilité des paiements pour votre centre de santé.
          </p>
        </div>

        {/* Features */}
        <div className="relative space-y-3">
          {['Facturation & couverture assurance', 'Gestion du stock en temps réel', 'Supervision multi-rôles'].map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" />
              <p className="text-sm text-white/70">{f}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Panneau droit - formulaire */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-sm space-y-8">

          {/* Mobile : logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-36 items-center justify-center overflow-hidden rounded-2xl bg-primary px-2">
              <Image
                src="/logo.png"
                alt="MediTrace"
                width={220}
                height={72}
                className="h-7 w-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Titre */}
          <div>
            <h2 className="text-2xl font-bold text-foreground">Connexion</h2>
            <p className="mt-1 text-sm text-muted-foreground">Accédez à votre espace de travail.</p>
          </div>

          {/* Formulaire */}
          <form className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Adresse email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="agent@clinicflow.bj"
                autoComplete="email"
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  aria-label={showPwd ? 'Masquer' : 'Afficher'}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition hover:text-foreground"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="h-11 w-full bg-primary text-white text-sm font-semibold hover:bg-primary/90">
              Se connecter
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Vous serez redirigé automatiquement vers votre espace selon votre rôle.
          </p>
        </div>
      </div>
    </div>
  );
}

