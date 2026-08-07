import { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { LogIn, LogOut, ShieldCheck, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AuthControlsProps {
  session: Session | null;
  isAdmin: boolean;
}

export function AuthControls({ session, isAdmin }: AuthControlsProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
    } else {
      setPassword('');
      setIsOpen(false);
    }
    setIsSubmitting(false);
  };

  const handleSignOut = async () => {
    setError(null);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) setError(signOutError.message);
  };

  if (session) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${
          isAdmin ? 'bg-orange-100 text-orange-800' : 'bg-gray-200 text-gray-700'
        }`}>
          {isAdmin ? <ShieldCheck className="h-4 w-4" /> : <User className="h-4 w-4" />}
          {session.user.email} · {isAdmin ? 'Admin' : 'Customer'}
        </span>
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setIsOpen(open => !open)}
        className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        <LogIn className="h-4 w-4" />
        Sign in
      </button>
      {isOpen && (
        <form onSubmit={handleSignIn} className="flex w-full max-w-xl flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-start">
          <div className="flex-1">
            <label htmlFor="auth-email" className="sr-only">Email</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="Email"
              autoComplete="email"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="auth-password" className="sr-only">Password</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      )}
    </div>
  );
}
