"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black text-white flex flex-col items-center py-5 px-4">

      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-blue-600 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-700 rounded-full mix-blend-screen filter blur-[128px] opacity-20"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-5xl w-full text-center space-y-6 mt-1">
        <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 font-medium text-sm mb-4">
          ISTQB® Foundation Level Preparation
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 drop-shadow-xl">
          Master Your Testing Skills
        </h1>
        <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
          The ultimate pure frontend experience built with Next.js App Router. Select your preferred practice mode to begin.
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="relative z-10 max-w-6xl w-full mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">

        {/* Card 1: Chapter Practice */}
        <div
          onClick={() => router.push('/setup/chapter')}
          className="group relative cursor-pointer bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)] flex flex-col items-center text-center overflow-hidden"
        >
          <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all duration-300 shadow-lg shadow-blue-500/10">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors">By Chapter</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Focus deeply on specific ISTQB syllabus chapters. Master individual testing concepts step-by-step.
          </p>
          <div className="mt-auto px-6 py-2.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold text-sm w-full group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
            Configure Chapter &rarr;
          </div>
        </div>

        {/* Card 2: Cumulative Exam */}
        <div
          onClick={() => router.push('/setup/cumulative')}
          className="group relative cursor-pointer bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] flex flex-col items-center text-center overflow-hidden"
        >
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all duration-300 shadow-lg shadow-emerald-500/10">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-300 transition-colors">Cumulative Exam</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Take a 40-question mock exam covering all chapters. Perfect for final evaluation.
          </p>
          <div className="mt-auto px-6 py-2.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-sm w-full group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
            Configure Exam &rarr;
          </div>
        </div>

        {/* Card 3: AI Adaptive Practice */}
        <div
          onClick={() => router.push('/setup/ai')}
          className="group relative cursor-pointer bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.3)] flex flex-col items-center text-center overflow-hidden"
        >
          <div className="w-20 h-20 bg-purple-500/20 text-purple-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-purple-500/30 transition-all duration-300 shadow-lg shadow-purple-500/10">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors">AI Adaptive</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Let AI dynamically generate questions based on your performance and weak points.
          </p>
          <div className="mt-auto px-6 py-2.5 rounded-full bg-purple-500/10 text-purple-400 font-semibold text-sm w-full group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
            Configure AI &rarr;
          </div>
        </div>

      </div>

    </main>
  );
}
