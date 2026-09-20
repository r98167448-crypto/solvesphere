'use client';

import React, { useEffect, useState } from 'react';

const AWARENESS_SLIDES = [
  {
    image: '/awareness/clean_water.jpg',
    title: 'Clean Water Initiative',
    subtitle: 'Restoring safe municipal drinking water across urban communities through smart sensing & pipe repair.'
  },
  {
    image: '/awareness/urban_green.jpg',
    title: 'Zero Waste & Green Urban Corridors',
    subtitle: 'Citizen volunteering, circular waste segregation, and tree planting to revitalize public spaces.'
  },
  {
    image: '/awareness/smart_roads.jpg',
    title: 'Safe Roads & Smart Infrastructure',
    subtitle: 'Eliminating critical potholes, installing solar street illumination, and ensuring pedestrian safety.'
  }
];

export function AwarenessCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % AWARENESS_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[420px] rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 mb-12">
      {AWARENESS_SLIDES.map((slide, index) => (
        <div
          key={slide.title}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Gradient Overlay for readable text */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-8 sm:p-12">
            <span className="inline-block text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full w-fit mb-3 border border-emerald-500/30">
              Community Awareness Campaign
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              {slide.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-200 mt-2 max-w-2xl drop-shadow">
              {slide.subtitle}
            </p>
          </div>
        </div>
      ))}

      {/* Progress Dots */}
      <div className="absolute bottom-4 right-8 z-20 flex gap-2">
        {AWARENESS_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'w-8 bg-emerald-400' : 'w-2.5 bg-white/50 hover:bg-white'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
