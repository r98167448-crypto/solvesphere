import './globals.css';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { AwarenessBackground } from '@/components/AwarenessBackground';

export const metadata: Metadata = {
  title: 'SolveSphere | AI-Driven Civic Problem Solving',
  description: 'Connecting Citizens, Government, Universities, Industry, and Schools to solve societal challenges.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50/60 text-slate-900 relative">
        {/* Transparent background rolling awareness images */}
        <AwarenessBackground />
        
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
          {children}
        </main>
        <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur py-6 text-center text-sm text-slate-500 relative z-10">
          <p>© 2026 SolveSphere</p>
        </footer>
      </body>
    </html>
  );
}
