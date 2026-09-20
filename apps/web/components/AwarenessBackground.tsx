'use client';

import React, { useEffect, useState } from 'react';

// Get base path dynamically for GitHub Pages repo deployment
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '/solvesphere';

const AWARENESS_SLIDES = [
  {
    image: `${BASE_PATH}/awareness/clean_water.jpg`,
    title: 'Clean Water Initiative',
    subtitle: 'Restoring safe municipal drinking water across urban communities through smart sensing & pipe repair.'
  },
  {
    image: `${BASE_PATH}/awareness/urban_green.jpg`,
    title: 'Zero Waste & Green Urban Corridors',
    subtitle: 'Citizen volunteering, circular waste segregation, and tree planting to revitalize public spaces.'
  },
  {
    image: `${BASE_PATH}/awareness/smart_roads.jpg`,
    title: 'Safe Roads & Smart Infrastructure',
    subtitle: 'Eliminating critical potholes, installing solar street illumination, and ensuring pedestrian safety.'
  }
];

export function AwarenessBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % AWARENESS_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {AWARENESS_SLIDES.map((slide, index) => (
        <div
          key={slide.title}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-25' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(0.5px)',
          }}
        />
      ))}
      {/* Light subtle gradient overlay to blend into body content cleanly */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/70 via-slate-50/85 to-slate-50/95" />
    </div>
  );
}
