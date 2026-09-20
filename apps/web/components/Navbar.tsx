'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, clearAuthSession, setAuthSession } from '@/lib/api';
import { 
  Globe, LogOut, LayoutDashboard, PlusCircle, 
  MapPin, ChevronDown, Building, Users, ShieldCheck, Award, Briefcase, GraduationCap
} from 'lucide-react';

const DEPARTMENTS = [
  { key: 'citizen', name: 'Citizen Portal', path: '/citizen/home', icon: Users, defaultEmail: 'citizen@gmail.com', defaultPass: 'citizen123' },
  { key: 'government', name: 'Government / Admin', path: '/admin/dashboard', icon: ShieldCheck, defaultEmail: 'admin@solvesphere.org', defaultPass: 'admin123' },
  { key: 'university', name: 'University Research Lab', path: '/university/dashboard', icon: Award, defaultEmail: 'univ@university.edu', defaultPass: 'univ123' },
  { key: 'industry', name: 'Industry & CSR', path: '/industry/dashboard', icon: Building, defaultEmail: 'csr@ecotech.com', defaultPass: 'industry123' },
  { key: 'school', name: 'School Eco Club', path: '/school/home', icon: GraduationCap, defaultEmail: 'ecoclub@stmarys.edu', defaultPass: 'school123' },
];

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [deptOpen, setDeptOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setUser(getCurrentUser());
  }, [pathname]);

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
    router.push('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'citizen': return '/citizen/home';
      case 'government':
      case 'admin': return '/admin/dashboard';
      case 'university': return '/university/dashboard';
      case 'industry': return '/industry/dashboard';
      case 'school': return '/school/home';
      default: return '/citizen/home';
    }
  };

  const switchDepartment = (dept: typeof DEPARTMENTS[0]) => {
    setDeptOpen(false);
    router.push(`/login?dept=${dept.key}`);
  };

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
              SolveSphere
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Civic AI
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/map"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">Public Map</span>
          </Link>

          {/* Department Choice Dropdown beside Dashboard */}
          <div className="relative">
            <button
              onClick={() => setDeptOpen(!deptOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition border border-slate-300/80"
            >
              <Building className="w-3.5 h-3.5 text-emerald-600" />
              <span>Department: <span className="text-emerald-700 capitalize">{user?.role || 'Switch'}</span></span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-slate-500" />
            </button>

            {deptOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Select Department Portal
                </div>
                {DEPARTMENTS.map((d) => {
                  const Icon = d.icon;
                  return (
                    <button
                      key={d.key}
                      onClick={() => switchDepartment(d)}
                      className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center gap-2.5 transition text-xs font-medium text-slate-700"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{d.name}</div>
                        <div className="text-[10px] text-slate-500">{d.key} access</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {user ? (
            <>
              <Link
                href={getDashboardLink()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline">Dashboard</span>
              </Link>

              {user.role === 'citizen' && (
                <Link
                  href="/citizen/submit"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Report Issue</span>
                </Link>
              )}

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-sm"
              >
                Sign In
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
