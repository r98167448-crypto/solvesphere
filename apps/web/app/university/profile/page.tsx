'use client';

import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Save, CheckCircle2 } from 'lucide-react';

export default function UniversityProfileForm() {
  const [department, setDepartment] = useState('Civil & Environmental Engineering');
  const [researchArea, setResearchArea] = useState('Smart Water Systems, Sustainable Waste Management, IoT Flood Sensors');
  const [lab, setLab] = useState('Urban Resilience Innovation Lab');
  const [priorProjects, setPriorProjects] = useState('Automated Lake De-siltation Drone, Stormwater Drainage Optimizer');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      await apiFetch('/universities/expertise', {
        method: 'PUT',
        body: JSON.stringify({
          department,
          research_area: researchArea,
          lab,
          prior_projects: priorProjects,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">University Expertise Profile</h1>
        <p className="text-xs text-slate-500">
          The AI matching microservice converts this information into semantic vector embeddings to rank community challenges.
        </p>
      </div>

      <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
        {saved && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Profile updated! AI matching vectors will be refreshed.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Academic Department</label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Laboratory or Research Center</label>
            <input
              type="text"
              required
              value={lab}
              onChange={(e) => setLab(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Key Research Areas & Domains</label>
            <textarea
              rows={3}
              required
              value={researchArea}
              onChange={(e) => setResearchArea(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Prior Projects & Patents</label>
            <textarea
              rows={3}
              value={priorProjects}
              onChange={(e) => setPriorProjects(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving Profile...' : 'Update Expertise Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
