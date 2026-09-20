'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Send, GraduationCap, CheckCircle2, Sparkles } from 'lucide-react';

export default function SchoolHomePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiFetch('/challenges', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          category: 'School & Youth Eco Club',
          district: 'School Campus / Neighborhood Zone',
        }),
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/citizen/home');
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Error submitting report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-6 space-y-6">
      <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl text-white shadow-md space-y-1">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6" />
          <h1 className="text-2xl font-black">School & Eco Club Portal</h1>
        </div>
        <p className="text-amber-100 text-xs">
          A simplified reporting form for students and eco-club representatives to flag school campus and pedestrian safety concerns.
        </p>
      </div>

      <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
        {success ? (
          <div className="text-center py-6 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-slate-900">Submitted!</h3>
            <p className="text-xs text-slate-500">Your school's report has been forwarded to the municipal triage desk.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">What is the issue?</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. Broken pavement near school gate or lack of pedestrian crossing"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Describe the problem</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500"
                placeholder="Explain why this is dangerous or inconvenient for students and teachers..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Submitting...' : 'Send School Report'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
