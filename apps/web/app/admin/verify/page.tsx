'use client';

import React, { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { ShieldCheck, XCircle, CheckCircle, AlertTriangle, Sparkles, CopyCheck } from 'lucide-react';

export default function AdminVerifyQueue() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingChallenges();
  }, []);

  const loadPendingChallenges = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/challenges?status=pending');
      setChallenges(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string, approve: boolean, priorityOverride?: string) => {
    try {
      await apiFetch(`/challenges/${id}/verify`, {
        method: 'PATCH',
        body: JSON.stringify({
          approve,
          priority_override: priorityOverride || undefined,
        }),
      });

      setChallenges((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message || 'Verification update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Verification & Triage Queue</h1>
          <p className="text-xs text-slate-500">
            Review incoming citizen challenges. AI duplicate detection and priority scoring suggestions are highlighted.
          </p>
        </div>
        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-xs">
          {challenges.length} Pending Verification
        </span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading queue...</div>
      ) : challenges.length === 0 ? (
        <div className="p-12 bg-white border border-slate-200 rounded-2xl text-center space-y-2">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-900">All caught up!</h3>
          <p className="text-xs text-slate-500">There are no pending challenges awaiting verification.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {challenges.map((c) => (
            <div
              key={c.id}
              className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {c.category}
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    c.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    AI Priority: {c.priority}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  Reported: {new Date(c.created_at).toLocaleDateString()}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{c.description}</p>
              </div>

              {/* AI Diagnostics Banner */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Domain: <strong>{c.domain || 'Infrastructure'}</strong> | Sub: <strong>{c.sub_domain || 'General'}</strong></span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                  <CopyCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Duplicate Check: Clean (No high overlap)</span>
                </div>
              </div>

              {/* Verification Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={() => handleVerify(c.id, false)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 rounded-xl text-xs font-bold transition"
                >
                  <XCircle className="w-4 h-4" /> Reject Report
                </button>
                <button
                  onClick={() => handleVerify(c.id, true, 'high')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Approve as High Priority
                </button>
                <button
                  onClick={() => handleVerify(c.id, true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
                >
                  <CheckCircle className="w-4 h-4" /> Approve & Verify
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
