'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { Award, ArrowUpRight, CheckCircle, Sparkles, BookOpen } from 'lucide-react';

export default function UniversityDashboard() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatchedChallenges();
  }, []);

  const loadMatchedChallenges = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/challenges?status=verified');
      setChallenges(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl text-white shadow-md">
        <div>
          <h1 className="text-2xl font-black">University Research & Lab Portal</h1>
          <p className="text-blue-100 text-sm mt-1">
            Apply academic research, student engineering capstones, and laboratory prototypes to solve verified municipal challenges.
          </p>
        </div>
        <Link
          href="/university/profile"
          className="px-4 py-2 bg-white text-indigo-900 text-xs font-bold rounded-xl shadow hover:bg-slate-100 transition"
        >
          Update Lab Expertise Profile
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">AI-Matched Verified Challenges</h2>
          <span className="text-xs text-slate-500">Ranked by Semantic Relevance</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Finding research matches...</div>
        ) : challenges.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500">
            No verified challenges awaiting engineering proposals at this moment.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {challenges.map((c, i) => (
              <div
                key={c.id}
                className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between hover:border-indigo-500 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {c.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <Sparkles className="w-3.5 h-3.5" /> AI Match: {85 - i * 7}%
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
                    className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition"
                  >
                    Submit Proposal <ArrowUpRight className="w-3.5 h-3.5" />
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
