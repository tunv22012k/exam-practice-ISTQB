"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExamStore, Question } from '../../../store/useExamStore';
import Link from 'next/link';
import allQuestionsRaw from '../../../data/index';

const allQuestions = allQuestionsRaw as Question[];

export default function ChapterSetupPage() {
  const router = useRouter();
  const { setExamConfig, startExam } = useExamStore();
  
  const [chapter, setChapter] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(15);

  const maxQuestions = chapter ? allQuestions.filter(q => q.chapter === parseInt(chapter)).length : 0;

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapter) return alert('Please select a chapter');
    if (questionCount > maxQuestions) {
      return alert(`Only ${maxQuestions} questions are available for this chapter.`);
    }
    
    setExamConfig({
      mode: 'chapter',
      chapters: [parseInt(chapter)],
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
        <div className="absolute top-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-blue-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-xl animate-fade-in-up">
        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Home
        </Link>
        
        <div className="bg-white/10 border border-white/20 p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            Chapter Practice Setup
          </h1>
          <p className="text-slate-400 mb-8">Configure your targeted practice session.</p>
          
          <form onSubmit={handleStart} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Chapter</label>
              <select 
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              >
                <option value="" disabled>Select a chapter from syllabus</option>
                <option value="1">Chapter 1: Fundamentals of Testing</option>
                <option value="2">Chapter 2: Testing Throughout the SDLC</option>
                <option value="3">Chapter 3: Static Testing</option>
                <option value="4">Chapter 4: Test Analysis and Design</option>
                <option value="5">Chapter 5: Managing the Test Activities</option>
                <option value="6">Chapter 6: Test Tools</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Number of Questions {chapter ? <span className="text-blue-400 font-bold ml-1">(Max available: {maxQuestions})</span> : null}
              </label>
              <input 
                type="number" 
                min="1"
                max={chapter ? maxQuestions : 50}
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
            
            <button 
              type="submit"
              className="w-full py-4 mt-8 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
            >
              Start Chapter Practice
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
