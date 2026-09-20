'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, setAuthSession } from '@/lib/api';
import { UserPlus, AlertCircle } from 'lucide-react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') || 'citizen';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role, phone }),
      });

      setAuthSession(data.access_token, data.user);

      // Route by chosen role
      switch (role) {
        case 'citizen': router.push('/citizen/home'); break;
        case 'government':
        case 'admin': router.push('/admin/dashboard'); break;
        case 'university': router.push('/university/profile'); break;
        case 'industry': router.push('/industry/profile'); break;
        case 'school': router.push('/school/home'); break;
        default: router.push('/citizen/home');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Create SolveSphere Account</h2>
        <p className="text-sm text-slate-600">Select your role to collaborate on societal solutions</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Select Role</label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {['citizen', 'government', 'university', 'industry', 'school', 'admin'].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className={`py-2 px-2.5 rounded-xl border text-center font-medium capitalize transition ${
                  role === r
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Name or Organization</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
            placeholder="e.g. Dr. A. Sharma / Tech Univ Eco Club"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
            placeholder="name@organization.edu"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Phone (Optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              placeholder="+91 9876543210"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 mt-4"
        >
          <UserPlus className="w-4 h-4" />
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Already registered?{' '}
        <Link href="/login" className="text-emerald-600 font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-slate-400">Loading signup portal...</div>}>
      <SignupForm />
    </Suspense>
  );
}
