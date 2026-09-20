'use client';

import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Save, CheckCircle2, Building2 } from 'lucide-react';

export default function IndustryProfileForm() {
  const [domain, setDomain] = useState('Clean Energy & Sustainable Infrastructure');
  const [techFocus, setTechFocus] = useState('Solar Microgrids, Recycled Polymer Pavements, Remote Sensing');
  const [csrInterest, setCsrInterest] = useState('Urban water rejuvenation, Youth technical skilling, Carbon neutrality');
  const [resources, setResources] = useState('Annual CSR Grant Budget ₹25 Lakhs, 10 Senior Engineering Mentors');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      await apiFetch('/industry/profile', {
        method: 'PUT',
        body: JSON.stringify({
          domain,
          tech_focus: techFocus,
          csr_interest: csrInterest,
          resources,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update CSR profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Industry & CSR Profile</h1>
        <p className="text-xs text-slate-500">
          Configure corporate focus areas and available mentorship/funding resources for AI matching.
        </p>
      </div>

      <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
        {saved && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            CSR Profile saved! Semantic match score active.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Primary Industry Domain</label>
            <input
              type="text"
              required
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Corporate Tech Focus & Expertise</label>
            <input
              type="text"
              required
              value={techFocus}
              onChange={(e) => setTechFocus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">CSR Interest Areas</label>
            <textarea
              rows={3}
              required
              value={csrInterest}
              onChange={(e) => setCsrInterest(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Available Resources (Grants, Mentors, Lab Access)</label>
            <textarea
              rows={3}
              value={resources}
              onChange={(e) => setResources(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving Profile...' : 'Update CSR Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
