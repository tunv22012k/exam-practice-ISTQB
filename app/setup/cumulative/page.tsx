"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useExamStore, Question } from '../../../store/useExamStore';
import Link from 'next/link';
import allExamQuestionsRaw from '../../../data/exam/index';

const examPool = allExamQuestionsRaw as Question[];

export default function CumulativeSetupPage() {
  const router = useRouter();
  const { setExamConfig, startExam } = useExamStore();

  const [activeTab, setActiveTab] = useState<'random' | 'predefined' | 'custom'>('random');



  // Predefined exams list
  const predefinedExams = useMemo(() => {
    const names = examPool.map((q: Question) => q.reference?.examName).filter(Boolean) as string[];
    return Array.from(new Set(names)).sort();
  }, [examPool]);

  // States
  const [selectedPredefined, setSelectedPredefined] = useState('');

  // Custom Setup state
  const [distribution, setDistribution] = useState<Record<number, number>>({
    1: 4, 2: 4, 3: 4, 4: 12, 5: 12, 6: 4
  });
  const [customTime, setCustomTime] = useState(90);

  const handleRandomStart = () => {
    setExamConfig({
      mode: 'cumulative',
      chapters: [1, 2, 3, 4, 5, 6],
      questionCount: 40,
      timeLimit: 90,
      isExamOnly: true
    });
    startExam();
    router.push('/exam');
  };

  const handlePredefinedStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPredefined) {
      alert("Please select an exam.");
      return;
    }

    setExamConfig({
      mode: 'predefined',
      predefinedExam: selectedPredefined,
      questionCount: 40, // overridden by predefined logic naturally, but we pass anyway
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
      timeLimit: customTime,
      isExamOnly: true
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
          <p className="text-slate-400 mb-8">Prepare for the full standard mock exam using exam-only questions.</p>

          <div className="flex space-x-2 mb-8 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 overflow-x-auto text-sm">
            <button
              onClick={() => setActiveTab('random')}
              className={`flex-1 min-w-[120px] py-3 px-2 rounded-lg font-medium transition-all ${activeTab === 'random' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              Random Mock
            </button>
            <button
              onClick={() => setActiveTab('predefined')}
              className={`flex-1 min-w-[120px] py-3 px-2 rounded-lg font-medium transition-all ${activeTab === 'predefined' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              Predefined Exams
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex-1 min-w-[120px] py-3 px-2 rounded-lg font-medium transition-all ${activeTab === 'custom' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              Custom by Chapter
            </button>
          </div>

          {activeTab === 'random' && (
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h2 className="text-2xl font-semibold">Standard Mock Exam</h2>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 max-w-sm mx-auto">
                <ul className="text-left text-slate-300 space-y-3 font-medium">
                  <li className="flex justify-between"><span>Total Questions:</span> <span className="text-emerald-400">40</span></li>
                  <li className="flex justify-between"><span>Time Limit:</span> <span className="text-emerald-400">90 mins</span></li>
                  <li className="flex justify-between"><span>Source:</span> <span className="text-emerald-400">Exam Pool ({examPool.length} Qs)</span></li>
                  <li className="flex justify-between"><span>Passing Score:</span> <span className="text-emerald-400">65% (26/40)</span></li>
                </ul>
              </div>
              <button
                onClick={handleRandomStart}
                className="w-full mt-4 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
              >
                Start Random Exam
              </button>
            </div>
          )}

          {activeTab === 'predefined' && (
            <form onSubmit={handlePredefinedStart} className="space-y-6 animate-fade-in-up">
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select an Exam</label>
                <select
                  value={selectedPredefined}
                  onChange={(e) => setSelectedPredefined(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  required
                >
                  <option value="" disabled>Select a predefined exam</option>
                  {predefinedExams.map(exam => (
                    <option key={exam} value={exam}>{exam}</option>
                  ))}
                </select>
                {selectedPredefined && (
                  <div className="mt-3 text-sm text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                    This exam contains <span className="font-bold">{examPool.filter((q: Question) => q.reference?.examName === selectedPredefined).length}</span> questions.
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full mt-4 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
              >
                Start Predefined Exam
              </button>
            </form>
          )}

          {activeTab === 'custom' && (
            <form onSubmit={handleCustomStart} className="space-y-6 animate-fade-in-up">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4">Chapter Distribution (from Exam Pool)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(ch => {
                    const availableForCh = examPool.filter((q: Question) => q.chapter === ch).length;
                    return (
                      <div key={ch} className="flex items-center justify-between bg-slate-800/40 p-4 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-colors">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Chapter {ch}</span>
                          <span className="text-xs text-slate-500">Max exam Qs: {availableForCh}</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          max={availableForCh}
                          value={distribution[ch] || 0}
                          onChange={(e) => updateDist(ch, e.target.value)}
                          className="w-16 bg-slate-900 border border-slate-600 text-emerald-400 font-bold rounded-lg p-2 text-center focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    )
                  })}
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
