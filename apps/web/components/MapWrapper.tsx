'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';

// Configure custom icons for Leaflet markers
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapWrapperProps {
  challenges: any[];
}

export default function MapWrapper({ challenges }: MapWrapperProps) {
  // Center default to Jharkhand (Ranchi central node)
  const defaultCenter: [number, number] = [23.3441, 85.3096];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={8}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {challenges.map((c) => {
        if (!c.lat || !c.lng) return null;
        return (
          <Marker
            key={c.id}
            position={[c.lat, c.lng]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="p-1 space-y-1.5 max-w-xs">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    c.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {c.priority} priority
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {c.category}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 leading-snug">{c.title}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-2">{c.description}</p>
                <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-600 font-semibold">{c.upvote_count} Upvotes</span>
                  <Link
                    href={`/citizen/challenge/${c.id}`}
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
