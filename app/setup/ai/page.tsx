"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExamStore, ExamConfig } from '../../../store/useExamStore';
import Link from 'next/link';

export default function AISetupPage() {
  const router = useRouter();
  const { setExamConfig, startExam } = useExamStore();
  
  const [difficulty, setDifficulty] = useState<ExamConfig['difficulty']>('normal');
  const [questionCount, setQuestionCount] = useState(20);
  const [timeLimit, setTimeLimit] = useState(30);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    setExamConfig({
      mode: 'ai',
      difficulty,
      questionCount,
      timeLimit
    });
    startExam();
    router.push('/exam');
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-900 flex flex-col items-center py-20 px-4 text-white">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-purple-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-xl animate-fade-in-up">
        <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Home
        </Link>
        
        <div className="bg-white/10 border border-white/20 p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-400">
            AI Adaptive Practice
          </h1>
          <p className="text-slate-400 mb-8">
            Tell the AI your parameters, and it will construct a targeted assessment based on your chosen difficulty level.
          </p>
          
          <form onSubmit={handleStart} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Target Difficulty</label>
              <select 
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as ExamConfig['difficulty'])}
                className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                required
              >
                <option value="easy">Easy (Fundamentals Focus & Obvious Answers)</option>
                <option value="normal">Normal (Standard Exam Distribution)</option>
                <option value="hard">Hard (Tricky Phrasing & Edge Cases)</option>
                <option value="mixed">Mixed (Adaptive Variance)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Number of Questions</label>
              <input 
                type="number" 
                min="5"
                max="100"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Time Limit (minutes)</label>
              <input 
                type="number" 
                min="1"
                max="120"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                required
              />
            </div>
            
            <button 
              type="submit"
              className="w-full py-4 mt-8 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400 text-white transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] flex justify-center items-center"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              Generate AI Exam & Start
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
