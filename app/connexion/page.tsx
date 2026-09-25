'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ConnexionPage() {
  const [mode, setMode] = useState<'login' | 'register'>(
    'login'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'register') setMode('register');
  }, []);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !password || (mode === 'register' && !name)) {
      setMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const user = {
      name: mode === 'register' ? name : email.split('@')[0],
      email,
      loggedIn: true,
    };

    localStorage.setItem('goalix_user', JSON.stringify(user));
    setMessage(
      mode === 'register'
        ? 'Compte de démonstration créé. Bienvenue sur GOALIX !'
        : 'Connexion de démonstration réussie.'
    );
    window.setTimeout(() => {
      window.location.href = '/dashboard';
    }, 700);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
        <section className="w-full rounded-[30px] border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-8">
          <Link href="/" className="text-sm font-bold text-slate-400 hover:text-white">← Retour à GOALIX</Link>

          <div className="mt-7 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-black text-slate-950 shadow-lg shadow-emerald-500/20">GX</div>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.25em] text-emerald-400">GOALIX ACCOUNT</p>
            <h1 className="mt-2 text-3xl font-black">{mode === 'login' ? 'Connexion' : 'Créer un compte'}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">Accédez à votre espace, votre coupon et vos paris.</p>
          </div>

          <div className="mt-7 grid grid-cols-2 rounded-2xl bg-white/5 p-1">
            <button type="button" onClick={() => setMode('login')} className={`rounded-xl px-3 py-3 text-sm font-black ${mode === 'login' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}>Connexion</button>
            <button type="button" onClick={() => setMode('register')} className={`rounded-xl px-3 py-3 text-sm font-black ${mode === 'register' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}>Inscription</button>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === 'register' && (
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Nom</span>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400" placeholder="Votre nom" />
              </label>
            )}
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">E-mail</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400" placeholder="vous@exemple.com" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Mot de passe</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400" placeholder="••••••••" />
            </label>

            <button type="submit" className="w-full rounded-2xl bg-emerald-500 px-5 py-4 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400">
              {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          {message && <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-300">✓ {message}</div>}

          <p className="mt-6 text-center text-[11px] leading-5 text-slate-500">Mode démonstration : ces identifiants sont stockés localement sur cet appareil. L'authentification serveur sécurisée sera ajoutée avant la mise en production.</p>
        </section>
      </div>
    </main>
  );
}
