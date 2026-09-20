'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch, getCurrentUser } from '@/lib/api';
import { ArrowLeft, Clock, MapPin, ThumbsUp, Tag, ShieldCheck, Sparkles } from 'lucide-react';

export function ChallengeDetailClient({ id }: { id: string }) {
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/challenges/${id}`);
      setChallenge(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    try {
      const res = await apiFetch(`/challenges/${id}/upvote`, { method: 'POST' });
      setChallenge((prev: any) => ({ ...prev, upvote_count: res.upvote_count }));
    } catch (err: any) {
      alert(err.message || 'Login to upvote');
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-400 text-sm">Loading challenge...</div>;
  if (!challenge) return <div className="py-12 text-center text-slate-500">Challenge not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/citizen/home" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600">
        <ArrowLeft className="w-4 h-4" /> Back to Challenges
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
              {challenge.category || 'General'}
            </span>
            <span className={`text-xs uppercase font-extrabold px-2.5 py-1 rounded-md ${
              challenge.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {challenge.priority} Priority
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs capitalize font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              Status: {challenge.status}
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
          {challenge.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 border-b border-slate-100 pb-4">
          {challenge.district && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{challenge.district}</span>
            </div>
          )}
          {challenge.created_at && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Reported on {new Date(challenge.created_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Problem Description</h3>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {challenge.description}
          </p>
        </div>

        {/* AI Semantic Tagging Insight */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
            <Sparkles className="w-4 h-4 text-emerald-600" /> AI Classification Diagnostics
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Domain</span>
              <span className="font-semibold text-slate-800">{challenge.domain || 'Infrastructure'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Sub-domain</span>
              <span className="font-semibold text-slate-800">{challenge.sub_domain || 'Civil Facility'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">AI Priority</span>
              <span className="font-semibold capitalize text-slate-800">{challenge.priority}</span>
            </div>
          </div>
        </div>

        {/* Media Preview */}
        {challenge.media && challenge.media.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Attached Media</h3>
            <div className="grid grid-cols-2 gap-4">
              {challenge.media.map((m: any) => (
                <img
                  key={m.id}
                  src={m.file_url}
                  alt="Challenge evidence"
                  className="rounded-xl w-full h-48 object-cover border border-slate-200"
                />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleUpvote}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition shadow-sm"
          >
            <ThumbsUp className="w-4 h-4" />
            Upvote This Issue ({challenge.upvote_count || 0})
          </button>
        </div>
      </div>
    </div>
  );
}
