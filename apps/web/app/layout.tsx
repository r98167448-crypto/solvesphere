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
          <p>© {new Date().getFullYear()} SolveSphere. Built with Next.js, FastAPI & AI.</p>
          <p className="mt-1">
            Author: <a href="https://github.com/r98167448-crypto" target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">Vishal R (GitHub)</a> | <a href="https://www.linkedin.com/in/vishal-r-63ab88394/" target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">LinkedIn</a>
          </p>
        </footer>
      </body>
    </html>
  );
}
