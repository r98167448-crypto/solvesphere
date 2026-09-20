'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch, getCurrentUser } from '@/lib/api';
import { FileText, Clock, ThumbsUp, ArrowRight } from 'lucide-react';

export default function MyReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const user = getCurrentUser();
      const all = await apiFetch('/challenges');
      // Filter for reports submitted by current user
      if (user) {
        setReports(all.filter((c: any) => c.submitted_by === user.id));
      } else {
        setReports(all);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">My Submitted Challenges</h1>
        <p className="text-xs text-slate-500">Track verification status, admin triage, and project updates on issues you raised</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading your submissions...</div>
      ) : reports.length === 0 ? (
        <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-slate-600 text-sm">You haven't submitted any civic challenges yet.</p>
          <Link
            href="/citizen/submit"
            className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700"
          >
            Submit an Issue
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div
              key={r.id}
              className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    r.status === 'verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : r.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {r.status}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{r.category}</span>
                </div>
                <h3 className="font-bold text-slate-900">{r.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-1">{r.description}</p>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <div className="flex items-center gap-1 text-xs text-emerald-700 font-bold">
                  <ThumbsUp className="w-3.5 h-3.5" /> {r.upvote_count}
                </div>
                <Link
                  href={`/citizen/challenge/${r.id}`}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-800"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
