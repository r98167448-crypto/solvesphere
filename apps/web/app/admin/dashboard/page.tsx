'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { 
  BarChart3, CheckCircle, Clock, AlertTriangle, 
  MapPin, FolderKanban, ShieldCheck, ArrowRight
} from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/analytics/dashboard');
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Government & Admin Command Hub</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Overview of civic challenges, triage queue, AI verification metrics, and municipal project oversight.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/verify"
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            <ShieldCheck className="w-4 h-4" /> Verification Queue
          </Link>
          <Link
            href="/admin/projects"
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            <FolderKanban className="w-4 h-4" /> Project Kanban
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Aggregating municipal analytics...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Reports</span>
              <p className="text-3xl font-black text-slate-900 mt-2">{analytics?.total || 0}</p>
            </div>
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <span className="text-xs font-bold text-emerald-600 uppercase">Verified</span>
              <p className="text-3xl font-black text-emerald-700 mt-2">{analytics?.verified || 0}</p>
            </div>
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <span className="text-xs font-bold text-amber-600 uppercase">In Progress</span>
              <p className="text-3xl font-black text-amber-700 mt-2">{analytics?.in_progress || 0}</p>
            </div>
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <span className="text-xs font-bold text-teal-600 uppercase">Resolved</span>
              <p className="text-3xl font-black text-teal-700 mt-2">{analytics?.completed || 0}</p>
            </div>
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm col-span-2 lg:col-span-1">
              <span className="text-xs font-bold text-indigo-600 uppercase">Resolution Rate</span>
              <p className="text-3xl font-black text-indigo-700 mt-2">{analytics?.resolution_rate || 0}%</p>
            </div>
          </div>

          {/* Breakdown Tables */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* By Category */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Challenges by Category</h3>
              <div className="space-y-2">
                {analytics?.by_category && Object.entries(analytics.by_category).map(([cat, count]: any) => (
                  <div key={cat} className="flex items-center justify-between text-sm py-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-700 font-medium">{cat}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-bold text-slate-800 text-xs">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* By District */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Challenges by District</h3>
              <div className="space-y-2">
                {analytics?.by_district && Object.entries(analytics.by_district).map(([dist, count]: any) => (
                  <div key={dist} className="flex items-center justify-between text-sm py-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-700 font-medium">{dist}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-bold text-slate-800 text-xs">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
