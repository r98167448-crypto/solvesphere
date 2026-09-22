'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Send, MapPin, Upload, Sparkles, CheckCircle2, Image as ImageIcon, X } from 'lucide-react';

export default function SubmitChallengePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [lat, setLat] = useState<number | undefined>(23.3441);
  const [lng, setLng] = useState<number | undefined>(85.3096);
  const [district, setDistrict] = useState('Ranchi, Jharkhand');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 3. Directly handle file upload instead of typing a URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large. Please select an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send base64 image data URI directly so image is immediately visible & stored
      const mediaList = imagePreview ? [imagePreview] : [];
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
          Upload photo evidence directly from your device. Our AI microservice will automatically classify domains and triage severity.
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

          {/* Direct Image File Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Attach Photo Evidence (Direct Upload)
            </label>
            
            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 w-full h-48 bg-slate-50 flex items-center justify-center">
                <img src={imagePreview} alt="Evidence preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2"
              >
                <div className="p-3 bg-slate-100 rounded-full text-slate-600">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="text-xs text-slate-700 font-semibold">
                  Click to browse and upload photo evidence
                </div>
                <p className="text-[11px] text-slate-400">Supports JPG, PNG, WEBP up to 5MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
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
                placeholder="e.g. Ranchi, Jharkhand"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Uploading & Classifying with AI...' : 'Submit Challenge'}
          </button>
        </form>
      )}
    </div>
  );
}
