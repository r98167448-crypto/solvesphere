'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, clearAuthSession } from '@/lib/api';
import { 
  Globe, User, LogOut, LayoutDashboard, PlusCircle, 
  MapPin, Bell, Briefcase, GraduationCap, Building2, BookOpen
} from 'lucide-react';

export function Navbar() {
  const [user, setUser] = useState<any>(null);
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

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
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
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/map"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">Public Map</span>
          </Link>

          {user ? (
            <>
              <Link
                href={getDashboardLink()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline">Dashboard</span>
              </Link>

              {user.role === 'citizen' && (
                <Link
                  href="/citizen/submit"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Report Issue</span>
                </Link>
              )}

              {user.role === 'school' && (
                <Link
                  href="/school/home"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">School Report</span>
                </Link>
              )}

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-900 leading-tight">{user.name}</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-600">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-3.5 py-1.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-sm shadow-emerald-600/20"
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
