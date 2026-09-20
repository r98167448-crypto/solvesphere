'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { apiFetch } from '@/lib/api';
import { Filter, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

// Dynamically import Leaflet map components for SSR safety
const MapComponent = dynamic(() => import('@/components/MapWrapper'), { ssr: false });

export default function PublicMapPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  useEffect(() => {
    loadChallenges();
  }, [selectedCategory, selectedPriority]);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      let query = '';
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedPriority !== 'all') params.append('priority', selectedPriority);
      if (params.toString()) query = `?${params.toString()}`;

      const data = await apiFetch(`/challenges${query}`);
      setChallenges(data);
    } catch (err) {
      console.error('Failed to load map data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Civic Hotspots & Challenges GIS Map</h1>
          <p className="text-xs text-slate-500">Live spatial mapping of citizen-reported infrastructure & environmental challenges</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium"
          >
            <option value="all">All Categories</option>
            <option value="Water">Water & Sanitation</option>
            <option value="Roads">Urban Roads</option>
            <option value="Waste">Environment & Waste</option>
            <option value="Education">Education</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Map Display Card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm h-[650px] relative">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            Loading GIS Data & OpenStreetMap Tiles...
          </div>
        ) : (
          <MapComponent challenges={challenges} />
        )}
      </div>
    </div>
  );
}
