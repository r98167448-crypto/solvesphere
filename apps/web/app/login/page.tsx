'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, setAuthSession } from '@/lib/api';
import { LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setAuthSession(data.access_token, data.user);

      // Redirect by role
      switch (data.user?.role) {
        case 'citizen':
          router.push('/citizen/home');
          break;
        case 'government':
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'university':
          router.push('/university/dashboard');
          break;
        case 'industry':
          router.push('/industry/dashboard');
          break;
        case 'school':
          router.push('/school/home');
          break;
        default:
          router.push('/citizen/home');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto my-10 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Sign in to SolveSphere</h2>
        <p className="text-sm text-slate-600">Access your role-specific dashboard and actions</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="citizen@gmail.com"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      {/* Demo Credentials Quick-Select */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Quick Demo Accounts</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => handleDemoFill('citizen@gmail.com', 'citizen123')}
            className="p-1.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 rounded-lg text-slate-700 text-left"
          >
            👤 Citizen
          </button>
          <button
            onClick={() => handleDemoFill('admin@solvesphere.org', 'admin123')}
            className="p-1.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 rounded-lg text-slate-700 text-left"
          >
            🛡️ Admin / Govt
          </button>
          <button
            onClick={() => handleDemoFill('univ@university.edu', 'univ123')}
            className="p-1.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 rounded-lg text-slate-700 text-left"
          >
            🎓 University
          </button>
          <button
            onClick={() => handleDemoFill('csr@ecotech.com', 'industry123')}
            className="p-1.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 rounded-lg text-slate-700 text-left"
          >
            🏢 Industry CSR
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        Don't have an account?{' '}
        <Link href="/signup" className="text-emerald-600 font-semibold hover:underline">
          Sign up with your role
        </Link>
      </p>
    </div>
  );
}
