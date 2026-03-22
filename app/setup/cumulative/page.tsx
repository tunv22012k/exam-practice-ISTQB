"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExamStore } from '../../../store/useExamStore';
import Link from 'next/link';

export default function CumulativeSetupPage() {
  const router = useRouter();
  const { setExamConfig, startExam } = useExamStore();
  
  const [activeTab, setActiveTab] = useState<'quick' | 'custom'>('quick');
  
  // Custom states
  const [distribution, setDistribution] = useState<Record<number, number>>({
    1: 4, 2: 4, 3: 4, 4: 12, 5: 12, 6: 4
  });
  const [customTime, setCustomTime] = useState(90);

  const handleQuickStart = () => {
    setExamConfig({
      mode: 'cumulative',
      chapters: [1, 2, 3, 4, 5, 6],
      questionCount: 40,
      timeLimit: 90
    });
    startExam();
    router.push('/exam');
  };

  const handleCustomStart = (e: React.FormEvent) => {
    e.preventDefault();
    const totalSelected = Object.values(distribution).reduce((a, b) => a + b, 0);
    if (totalSelected === 0) return alert('Please select at least 1 question.');
    
    setExamConfig({
      mode: 'cumulative',
      chapterDistribution: distribution,
      questionCount: totalSelected,
      timeLimit: customTime
    });
    startExam();
    router.push('/exam');
  };

  const updateDist = (chapter: number, val: string) => {
    const num = parseInt(val) || 0;
    setDistribution(prev => ({ ...prev, [chapter]: num }));
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-900 flex flex-col items-center py-20 px-4 text-white">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-emerald-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-2xl animate-fade-in-up">
        <Link href="/" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Home
        </Link>
        
        <div className="bg-white/10 border border-white/20 p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
            Cumulative Exam Setup
          </h1>
          <p className="text-slate-400 mb-8">Prepare for the full standard mock exam or customize your own.</p>
          
          <div className="flex space-x-2 mb-8 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
            <button 
              onClick={() => setActiveTab('quick')}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${activeTab === 'quick' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              Quick Start
            </button>
            <button 
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${activeTab === 'custom' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              Custom Setup
            </button>
          </div>

          {activeTab === 'quick' ? (
            <div className="text-center py-8 space-y-6">
              <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h2 className="text-2xl font-semibold">Standard Mock Exam</h2>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 max-w-sm mx-auto">
                <ul className="text-left text-slate-300 space-y-3 font-medium">
                  <li className="flex justify-between"><span>Total Questions:</span> <span className="text-emerald-400">40</span></li>
                  <li className="flex justify-between"><span>Time Limit:</span> <span className="text-emerald-400">90 mins</span></li>
                  <li className="flex justify-between"><span>Passing Score:</span> <span className="text-emerald-400">65% (26/40)</span></li>
                </ul>
              </div>
              <button 
                onClick={handleQuickStart}
                className="w-full mt-4 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
              >
                Start Automatic Exam
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomStart} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4">Chapter Distribution (Questions per chapter)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1,2,3,4,5,6].map(ch => (
                    <div key={ch} className="flex items-center justify-between bg-slate-800/40 p-4 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-colors">
                      <span className="text-sm font-medium">Chapter {ch}</span>
                      <input 
                        type="number" 
                        min="0"
                        max="20"
                        value={distribution[ch] || 0}
                        onChange={(e) => updateDist(ch, e.target.value)}
                        className="w-16 bg-slate-900 border border-slate-600 text-emerald-400 font-bold rounded-lg p-2 text-center focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex justify-between items-center">
                  <span className="text-emerald-400 font-medium">Total Questions Selected</span>
                  <span className="text-2xl font-bold text-white">{Object.values(distribution).reduce((a, b) => a + b, 0)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Total Time Limit (minutes)</label>
                <input 
                  type="number" 
                  min="1"
                  max="180"
                  value={customTime}
                  onChange={(e) => setCustomTime(parseInt(e.target.value))}
                  className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-lg"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 mt-6 rounded-xl font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
              >
                Start Custom Exam
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
