'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch, getCurrentUser } from '@/lib/api';
import { ThumbsUp, MapPin, Tag, PlusCircle, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function CitizenHome() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
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

  const handleUpvote = async (id: string) => {
    try {
      const res = await apiFetch(`/challenges/${id}/upvote`, { method: 'POST' });
      setChallenges((prev) =>
        prev.map((c) => (c.id === id ? { ...c, upvote_count: res.upvote_count } : c))
      );
    } catch (err: any) {
      alert(err.message || 'Please log in to upvote');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl text-white shadow-md">
        <div>
          <h1 className="text-2xl font-black">Citizen Portal</h1>
          <p className="text-emerald-100 text-sm mt-1">
            Discover community challenges, upvote urgent civic issues, and track resolutions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/citizen/my-reports"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition backdrop-blur"
          >
            My Submissions
          </Link>
          <Link
            href="/citizen/submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-emerald-800 text-xs font-bold rounded-xl shadow hover:bg-slate-100 transition"
          >
            <PlusCircle className="w-4 h-4" /> Report Issue
          </Link>
        </div>
      </div>

      {/* Challenges Feed */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Nearby Civic Challenges</h2>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Loading challenges...</div>
        ) : challenges.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-500">
            No challenges reported yet. Be the first to submit one!
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {challenges.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {c.category || 'General'}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                        c.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : c.priority === 'low'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {c.priority}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 line-clamp-2 leading-snug hover:text-emerald-700">
                    <Link href={`/citizen/challenge/${c.id}`}>{c.title}</Link>
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {c.description}
                  </p>

                  {c.district && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {c.district}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleUpvote(c.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{c.upvote_count} Upvotes</span>
                  </button>

                  <Link
                    href={`/citizen/challenge/${c.id}`}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-emerald-600"
                  >
                    Details <ArrowUpRight className="w-3.5 h-3.5" />
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
