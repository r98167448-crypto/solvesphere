'use client';

import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/api';
import { User, Mail, Phone, Shield } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  if (!user) {
    return <div className="py-12 text-center text-slate-500">Please sign in to view your profile.</div>;
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-black text-slate-900">User Profile</h1>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {user.role}
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
          <div className="flex items-center gap-3 text-slate-600">
            <Mail className="w-4 h-4 text-slate-400" />
            <span>{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-3 text-slate-600">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{user.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-slate-600">
            <Shield className="w-4 h-4 text-slate-400" />
            <span>Account verified & active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
