'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Send, MapPin, Upload, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SubmitChallengePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [lat, setLat] = useState<number | undefined>(12.9716);
  const [lng, setLng] = useState<number | undefined>(77.5946);
  const [district, setDistrict] = useState('Bengaluru Central');
  const [mediaUrl, setMediaUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const mediaList = mediaUrl.trim() ? [mediaUrl.trim()] : [];
      await apiFetch('/challenges', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          category: category || undefined,
          lat,
          lng,
          district,
          media: mediaList,
        }),
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/citizen/home');
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Error submitting challenge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-6 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="mb-6 space-y-1">
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> AI Assisted Triage
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Report a Local Societal Challenge</h1>
        <p className="text-xs text-slate-500">
          Our AI microservice will automatically classify domains, estimate priority severity, and check for duplicates.
        </p>
      </div>

      {success ? (
        <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-lg text-emerald-900">Challenge Reported Successfully!</h3>
          <p className="text-xs text-emerald-700">Redirecting to your feed...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Issue Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Broken water pipeline leaking near market entrance"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Detailed Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              placeholder="Describe the exact issue, approximate population affected, duration, and safety hazards..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Category (Optional)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">AI Auto-Detect Category</option>
                <option value="Water & Sanitation">Water & Sanitation</option>
                <option value="Urban Infrastructure">Urban Infrastructure</option>
                <option value="Environment & Waste">Environment & Waste</option>
                <option value="Education">Education</option>
                <option value="Public Health">Public Health</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">District / Locality</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Bengaluru Central"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={lat || ''}
                onChange={(e) => setLat(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={lng || ''}
                onChange={(e) => setLng(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Photo / Media URL (Optional)</label>
            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Submitting & Classifying with AI...' : 'Submit Challenge'}
          </button>
        </form>
      )}
    </div>
  );
}
