'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, ShieldCheck, Cpu, Users, Building, 
  Sparkles, CheckCircle2, MapPin, Activity, Award
} from 'lucide-react';

export default function LandingPage() {
  const roles = [
    { title: 'Citizens Portal', desc: 'Report neighborhood issues with direct photo uploads and track live resolution.', icon: Users, link: '/login?dept=citizen' },
    { title: 'Government & Admin', desc: 'AI-assisted verification, triage queue, and project allocation.', icon: ShieldCheck, link: '/login?dept=government' },
    { title: 'Universities & Labs', desc: 'Provide engineering and scientific expertise for community solutions.', icon: Award, link: '/login?dept=university' },
    { title: 'Industry & CSR', desc: 'Fund vetted sustainable civic projects and provide mentorship.', icon: Building, link: '/login?dept=industry' },
  ];

  return (
    <div className="space-y-12 py-6">
      {/* Hero Header */}
      <section className="text-center max-w-4xl mx-auto space-y-5 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-emerald-700 text-xs font-semibold tracking-wide backdrop-blur-sm shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Civic Problem Solving
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950">
          Bridging Citizens and Institutions to{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Solve Local Crises
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          SolveSphere brings together Citizens, Government, Academic Labs, and Industry CSR to verify, prioritize, and collaboratively engineer solutions for real societal challenges.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/login"
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/25 transition hover:scale-[1.02]"
          >
            Access Department Portal <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/map"
            className="flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur hover:bg-slate-50 text-slate-800 font-semibold border border-slate-300 rounded-xl shadow-sm transition hover:scale-[1.02]"
          >
            <MapPin className="w-4 h-4 text-emerald-600" /> Explore Public Map
          </Link>
        </div>
      </section>

      {/* Role Directory */}
      <section className="space-y-6 pt-4">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">Dedicated Department Portals</h2>
          <p className="text-xs text-slate-500">Sign in directly to your institutional role</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((r, i) => {
            const Icon = r.icon;
            return (
              <Link
                key={i}
                href={r.link}
                className="group p-6 bg-white/85 backdrop-blur border border-slate-200 hover:border-emerald-500 rounded-2xl transition duration-200 flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-emerald-100 group-hover:text-emerald-700 text-slate-700 flex items-center justify-center transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition">{r.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{r.desc}</p>
                </div>
                <div className="pt-4 flex items-center text-xs font-semibold text-emerald-600 gap-1 group-hover:translate-x-1 transition">
                  Sign In to Department <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* AI Features Grid */}
      <section className="grid sm:grid-cols-3 gap-6 pt-4">
        <div className="p-6 bg-white/85 backdrop-blur border border-slate-200 shadow-sm rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Semantic AI Classification</h3>
          <p className="text-xs text-slate-600">
            Automatically categorizes issues across Water, Road Infrastructure, and Waste Management using NLP.
          </p>
        </div>

        <div className="p-6 bg-white/85 backdrop-blur border border-slate-200 shadow-sm rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Duplicate Detection</h3>
          <p className="text-xs text-slate-600">
            Vector cosine similarity flags redundant reports so government officials can pool upvotes.
          </p>
        </div>

        <div className="p-6 bg-white/85 backdrop-blur border border-slate-200 shadow-sm rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Smart Expertise Match</h3>
          <p className="text-xs text-slate-600">
            Matches engineering challenges directly with relevant university research labs and corporate CSR funding.
          </p>
        </div>
      </section>
    </div>
  );
}
