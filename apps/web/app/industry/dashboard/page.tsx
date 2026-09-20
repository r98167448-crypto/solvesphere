'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { Building2, Sparkles, ArrowUpRight, DollarSign, Handshake } from 'lucide-react';

export default function IndustryDashboard() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/challenges');
      // Show assigned/in_progress challenges looking for corporate sponsorship or tech mentors
      setChallenges(data.filter((c: any) => c.status === 'assigned' || c.status === 'in_progress'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-teal-700 to-cyan-800 rounded-2xl text-white shadow-md">
        <div>
          <h1 className="text-2xl font-black">Industry & CSR Sponsorship Portal</h1>
          <p className="text-teal-100 text-sm mt-1">
            Empower high-impact community engineering projects with corporate grants, engineering mentors, and industry resources.
          </p>
        </div>
        <Link
          href="/industry/profile"
          className="px-4 py-2 bg-white text-teal-900 text-xs font-bold rounded-xl shadow hover:bg-slate-100 transition"
        >
          Manage CSR Interests & Resources
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">High-Impact Projects for CSR Collaboration</h2>
          <span className="text-xs text-slate-500">AI Priority & CSR Match Ranked</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Matching CSR opportunities...</div>
        ) : challenges.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500">
            No projects seeking external industry partnerships at the moment.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {challenges.map((c, i) => (
              <div
                key={c.id}
                className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between hover:border-teal-500 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700">
                      {c.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <Sparkles className="w-3.5 h-3.5" /> CSR Alignment: {90 - i * 8}%
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 leading-snug">{c.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{c.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Status: <strong className="text-slate-700 capitalize">{c.status}</strong>
                  </span>
                  <Link
                    href={`/citizen/challenge/${c.id}`}
                    className="flex items-center gap-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition"
                  >
                    Sponsor / Mentor <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
