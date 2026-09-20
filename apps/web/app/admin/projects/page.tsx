'use client';

import React, { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { FolderKanban, CheckSquare, Plus, Clock } from 'lucide-react';

export default function AdminProjectsKanban() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/challenges');
      setChallenges(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Verified / Backlog', status: 'verified' },
    { title: 'Assigned to University/Lab', status: 'assigned' },
    { title: 'In Progress / Prototyping', status: 'in_progress' },
    { title: 'Completed & Certified', status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Project Oversight Kanban</h1>
          <p className="text-xs text-slate-500">Track cross-institutional civic projects from lab prototype to field resolution</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading projects...</div>
      ) : (
        <div className="grid md:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colItems = challenges.filter((c) => c.status === col.status);
            return (
              <div key={col.status} className="bg-slate-100/70 p-4 rounded-2xl space-y-3 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">{col.title}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-white text-slate-800 text-xs font-bold shadow-xs">
                    {colItems.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colItems.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2 hover:border-emerald-500 transition"
                    >
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        {c.category}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 leading-snug">{c.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{c.description}</p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{c.upvote_count} Upvotes</span>
                        <span className="font-semibold text-slate-700 capitalize">{c.priority} Priority</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
