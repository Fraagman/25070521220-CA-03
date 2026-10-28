import React, { useState } from 'react';
import { X, Skull, Flame, ShieldAlert, KeyRound, Mail, UserCheck, ArrowRight, Droplets } from 'lucide-react';
import type { User } from '../types';
import { signin, signup, saveAuth } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bloodType, setBloodType] = useState('O-Negative');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Dispatch email and password cipher are required.');
      return;
    }

    try {
      setLoading(true);

      if (mode === 'signup') {
        if (!name.trim()) {
          setError('Patron codename / moniker is required.');
          setLoading(false);
          return;
        }

        const res = await signup({
          name: name.trim(),
          email: email.trim(),
          password,
          bloodType,
        });

        saveAuth(res.token, res.user);
        onAuthSuccess(res.user);
        onClose();
      } else {
        const res = await signin({
          email: email.trim(),
          password,
        });

        saveAuth(res.token, res.user);
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication rejected by MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#0d090b] border-4 border-[#ff0033] shadow-[12px_12px_0px_#000] text-white my-8 overflow-hidden">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between p-4 bg-black border-b-2 border-red-900/80">
          <div className="flex items-center space-x-2">
            <Skull className="w-5 h-5 text-[#ff0033]" />
            <span className="text-sm font-black uppercase tracking-wider text-white font-mono">
              {mode === 'signup' ? 'PATRON INITIATION' : 'ABYSS ENTRANCE'}
            </span>
          </div>

          <button
            onClick={onClose}
            data-testid="close-auth-modal"
            className="p-1 border border-zinc-700 hover:border-[#ff0033] text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 border-b-2 border-zinc-800 bg-zinc-950 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            data-testid="tab-signin"
            className={`py-3 text-center font-black uppercase tracking-wider transition-colors border-r border-zinc-800 ${
              mode === 'signin'
                ? 'bg-[#ff0033] text-black'
                : 'text-zinc-400 hover:text-white hover:bg-black/50'
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            data-testid="tab-signup"
            className={`py-3 text-center font-black uppercase tracking-wider transition-colors ${
              mode === 'signup'
                ? 'bg-[#ff0033] text-black'
                : 'text-zinc-400 hover:text-white hover:bg-black/50'
            }`}
          >
            NEW INITIATE (SIGN UP)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-mono text-xs">
          {error && (
            <div className="p-3 bg-red-950 border-2 border-red-600 text-red-200 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-zinc-400 uppercase font-bold mb-1">
                PATRON MONIKER / CODENAME *
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vladislav"
                  data-testid="input-name"
                  className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] pl-9 pr-3 py-2 text-white outline-none"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-zinc-400 uppercase font-bold mb-1">
              DISPATCH EMAIL *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="initiate@carnage.realm"
                data-testid="input-email"
                className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] pl-9 pr-3 py-2 text-white outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 uppercase font-bold mb-1">
              PASSWORD CIPHER (MIN 6 CHARS) *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                data-testid="input-password"
                className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] pl-9 pr-3 py-2 text-white outline-none"
                required
                minLength={6}
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-zinc-400 uppercase font-bold mb-1 flex items-center space-x-1">
                <Droplets className="w-3.5 h-3.5 text-[#ff0033]" />
                <span>BLOOD CLASSIFICATION</span>
              </label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                data-testid="select-blood-type"
                className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] px-3 py-2 text-white outline-none"
              >
                <option value="O-Negative">O-Negative (Universal Donor)</option>
                <option value="O-Positive">O-Positive</option>
                <option value="A-Negative">A-Negative</option>
                <option value="A-Positive">A-Positive</option>
                <option value="B-Negative">B-Negative</option>
                <option value="B-Positive">B-Positive</option>
                <option value="AB-Negative">AB-Negative</option>
                <option value="AB-Positive">AB-Positive (Universal Recipient)</option>
              </select>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              data-testid="submit-auth-button"
              className="w-full bg-[#ff0033] text-black hover:bg-red-600 disabled:bg-zinc-800 disabled:text-zinc-600 font-black uppercase text-xs py-3.5 tracking-wider flex items-center justify-center space-x-2 shadow-[4px_4px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <Flame className="w-4 h-4 text-black" />
              <span>
                {loading
                  ? 'SYNCHRONIZING WITH MONGODB...'
                  : mode === 'signup'
                  ? 'COMMIT INITIATION & ENTER'
                  : 'VALIDATE CIPHER & ENTER'}
              </span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>

          <div className="text-center pt-2 border-t border-zinc-900 text-[11px] text-zinc-500">
            {mode === 'signin' ? (
              <p>
                Not in the archives yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="text-[#ff0033] font-bold uppercase underline ml-1"
                >
                  Initiate Blood Oath
                </button>
              </p>
            ) : (
              <p>
                Already initiated?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                  }}
                  className="text-[#ff0033] font-bold uppercase underline ml-1"
                >
                  Enter with Cipher
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
