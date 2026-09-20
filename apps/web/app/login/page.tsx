'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, setAuthSession } from '@/lib/api';
import { 
  LogIn, AlertCircle, Users, ShieldCheck, Award, Building, GraduationCap, ArrowRight
} from 'lucide-react';

const DEPARTMENTS = [
  { 
    key: 'citizen', 
    name: 'Citizen Portal', 
    desc: 'Public problem reporting & community upvoting', 
    icon: Users, 
    email: 'citizen@gmail.com', 
    pass: 'citizen123',
    color: 'emerald'
  },
  { 
    key: 'government', 
    name: 'Government & Admin', 
    desc: 'Triage queue, duplicate review & project commissioning', 
    icon: ShieldCheck, 
    email: 'admin@solvesphere.org', 
    pass: 'admin123',
    color: 'slate'
  },
  { 
    key: 'university', 
    name: 'University Research Lab', 
    desc: 'Engineering prototypes & research matching', 
    icon: Award, 
    email: 'univ@university.edu', 
    pass: 'univ123',
    color: 'blue'
  },
  { 
    key: 'industry', 
    name: 'Industry & Corporate CSR', 
    desc: 'Sponsorship grants, engineering mentors & collaboration', 
    icon: Building, 
    email: 'csr@ecotech.com', 
    pass: 'industry123',
    color: 'teal'
  },
  { 
    key: 'school', 
    name: 'School Eco Club', 
    desc: 'Simplified student safety & pedestrian reports', 
    icon: GraduationCap, 
    email: 'ecoclub@stmarys.edu', 
    pass: 'school123',
    color: 'amber'
  },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deptQuery = searchParams.get('dept');

  const [activeDept, setActiveDept] = useState('citizen');
  const [email, setEmail] = useState('citizen@gmail.com');
  const [password, setPassword] = useState('citizen123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (deptQuery && DEPARTMENTS.some((d) => d.key === deptQuery)) {
      selectDepartment(deptQuery);
    }
  }, [deptQuery]);

  const selectDepartment = (deptKey: string) => {
    setActiveDept(deptKey);
    const d = DEPARTMENTS.find((item) => item.key === deptKey);
    if (d) {
      setEmail(d.email);
      setPassword(d.pass);
    }
  };

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

      // Dedicated department routing
      switch (data.user?.role) {
        case 'citizen': router.push('/citizen/home'); break;
        case 'government':
        case 'admin': router.push('/admin/dashboard'); break;
        case 'university': router.push('/university/dashboard'); break;
        case 'industry': router.push('/industry/dashboard'); break;
        case 'school': router.push('/school/home'); break;
        default: router.push('/citizen/home');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Verify credentials for this department.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 space-y-8">
      {/* 2. Isolated Department Picker Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900">Institutional Sign-In Portal</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Please select your specific department before signing in to access your authorized dashboard.
        </p>
      </div>

      {/* Department Tabs */}
      <div className="grid sm:grid-cols-5 gap-3">
        {DEPARTMENTS.map((d) => {
          const Icon = d.icon;
          const isSelected = activeDept === d.key;
          return (
            <button
              type="button"
              key={d.key}
              onClick={() => selectDepartment(d.key)}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="space-y-2">
                <div className={`p-2 rounded-xl w-fit ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold leading-tight ${isSelected ? 'text-emerald-950 font-black' : 'text-slate-800'}`}>
                    {d.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">{d.desc}</p>
                </div>
              </div>
              <div className="mt-3 text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                {isSelected ? 'Selected' : 'Select'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Login Box */}
      <div className="max-w-md mx-auto p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="mb-6 pb-4 border-b border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Signing In As</span>
          <h2 className="text-lg font-extrabold text-slate-900 capitalize">
            {DEPARTMENTS.find((d) => d.key === activeDept)?.name}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Department Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Verifying Credentials...' : 'Sign In to Department'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          New institutional member?{' '}
          <Link href={`/signup?role=${activeDept}`} className="text-emerald-600 font-bold hover:underline">
            Register for {activeDept}
          </Link>
        </p>
      </div>
    </div>
  );
}
