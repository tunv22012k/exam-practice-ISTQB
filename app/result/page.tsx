"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExamStore } from '../../store/useExamStore';

export default function ResultPage() {
  const router = useRouter();
  const { examQuestions, userAnswers, examState, resetExam } = useExamStore();
  const [isCalculated, setIsCalculated] = useState(false);

  // Stats
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [unattemptedCount, setUnattemptedCount] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [isPass, setIsPass] = useState(false);

  useEffect(() => {
    // Basic protection against direct navigation
    if (examState !== 'submitted' || examQuestions.length === 0) {
      router.push('/');
      return;
    }

    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    examQuestions.forEach(q => {
      const uAns = userAnswers[q.id];
      const cAns = q.correctAnswer;
      
      if (!uAns || (Array.isArray(uAns) && uAns.length === 0)) {
        unattempted++;
      } else {
        const isCorrect = Array.isArray(cAns) 
          ? (Array.isArray(uAns) && uAns.length === cAns.length && uAns.every(val => cAns.includes(val)))
          : uAns === cAns;
          
        if (isCorrect) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });

    setCorrectCount(correct);
    setIncorrectCount(incorrect);
    setUnattemptedCount(unattempted);
    
    const pct = Math.round((correct / examQuestions.length) * 100);
    setPercentage(pct);
    setIsPass(pct >= 65);
    setIsCalculated(true);

  }, [examQuestions, userAnswers, examState, router]);

  const handleReturnHome = () => {
    resetExam();
    router.push('/');
  };

  if (!isCalculated) return null;

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 flex flex-col items-center">
      {/* Overview Card */}
      <div className="w-full max-w-4xl bg-slate-800/80 border border-slate-700 p-8 md:p-12 rounded-[2.5rem] shadow-2xl mb-12 relative overflow-hidden">
        {/* Dynamic background for Pass/Fail */}
        <div className={`absolute -top-32 -right-32 w-96 h-96 rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none ${isPass ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full border border-slate-600 bg-slate-700/50 text-slate-300 font-medium text-sm mb-6">
            Exam Evaluation
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white text-shadow">Results Summary</h1>
          <div className={`text-6xl md:text-8xl font-black mb-4 tracking-tight drop-shadow-lg ${isPass ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPass ? 'PASS' : 'FAIL'}
          </div>
          <p className="text-xl md:text-2xl text-slate-300 font-medium">
            You scored <span className="text-white font-bold">{percentage}%</span> ({correctCount}/{examQuestions.length} points)
            <span className="text-sm block md:inline md:ml-2 text-slate-400 font-normal">(Minimum passing score is 65%)</span>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center relative z-10">
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-700 shadow-inner">
            <div className="text-3xl font-bold text-blue-400">{examQuestions.length}</div>
            <div className="text-slate-400 text-xs uppercase tracking-wider mt-2 font-medium">Total</div>
          </div>
          <div className="bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20 shadow-inner">
            <div className="text-3xl font-bold text-emerald-400">{correctCount}</div>
            <div className="text-emerald-400/80 text-xs uppercase tracking-wider mt-2 font-medium">Correct</div>
          </div>
          <div className="bg-red-500/10 p-6 rounded-3xl border border-red-500/20 shadow-inner">
            <div className="text-3xl font-bold text-red-400">{incorrectCount}</div>
            <div className="text-red-400/80 text-xs uppercase tracking-wider mt-2 font-medium">Incorrect</div>
          </div>
          <div className="bg-slate-700/30 p-6 rounded-3xl border border-slate-600 shadow-inner">
            <div className="text-3xl font-bold text-slate-300">{unattemptedCount}</div>
            <div className="text-slate-400 text-xs uppercase tracking-wider mt-2 font-medium">Missed</div>
          </div>
        </div>

        <div className="mt-12 flex justify-center relative z-10">
          <button 
            onClick={handleReturnHome}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:-translate-y-1 flex items-center"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Start New Session
          </button>
        </div>
      </div>

      {/* Detailed Review Section */}
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex items-center justify-between border-b border-slate-700 pb-4">
           <h2 className="text-2xl font-bold">Detailed Review</h2>
           <span className="text-slate-400 text-sm">{examQuestions.length} Questions</span>
        </div>

        {examQuestions.map((q, idx) => {
          const uAns = userAnswers[q.id];
          const cAns = q.correctAnswer;
          const isCorrect = Array.isArray(cAns) 
            ? (Array.isArray(uAns) && uAns.length === cAns.length && uAns.every(val => cAns.includes(val)))
            : uAns === cAns;
          const isUnattempted = !uAns || (Array.isArray(uAns) && uAns.length === 0);

          return (
            <div key={q.id} className="bg-slate-800/40 border border-slate-700/50 rounded-[2rem] p-6 md:p-8 hover:bg-slate-800/60 transition-colors">
              <div className="flex flex-wrap gap-2 items-center justify-between mb-6">
                <div className="flex gap-3">
                   <span className="text-blue-400 font-bold text-sm bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full">
                     Question {idx + 1}
                   </span>
                   <span className="text-slate-400 text-sm bg-slate-700/50 border border-slate-600 px-3 py-1.5 rounded-full">
                     Chapter {q.chapter}
                   </span>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider ${isUnattempted ? 'bg-slate-700 text-slate-300' : isCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'}`}>
                   {isUnattempted ? 'UNATTEMPTED' : isCorrect ? 'CORRECT' : 'INCORRECT'}
                </span>
              </div>
              
              {q.reference && (
                <div className="mb-4 text-amber-400/90 text-sm italic">
                  Tương ứng với câu <span className="font-bold">{q.reference.questionNumber}</span> của bài tập <span className="font-bold">{q.reference.examName}</span>
                </div>
              )}
              <h3 className="text-xl md:text-2xl font-medium mb-6 leading-relaxed text-slate-100 whitespace-pre-line">{q.questionText}</h3>
              
              {q.imageUrl && (
                <div className="mb-8 rounded-xl overflow-hidden border border-slate-700/50 bg-slate-900/50 flex justify-start p-4">
                  <img src={q.imageUrl} alt="Question reference" className="max-w-full h-auto max-h-[400px] object-contain rounded" />
                </div>
              )}
              
              <div className="space-y-3 mb-8">
                {q.options.map((opt, oIdx) => {
                  const isUserSelection = Array.isArray(uAns) ? uAns.includes(opt) : uAns === opt;
                  const isActualCorrect = Array.isArray(cAns) ? cAns.includes(opt) : cAns === opt;
                  
                  let optStyle = "bg-slate-900/40 border-slate-700 text-slate-400";
                  let icon = null;
                  let badges = [];

                  if (isUserSelection && isActualCorrect) {
                     optStyle = "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 ring-1 ring-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                     icon = <svg className="w-6 h-6 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>;
                     badges.push(<span key="correct" className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-400">LỰA CHỌN ĐÚNG CỦA BẠN</span>);
                  } else if (isUserSelection && !isActualCorrect) {
                     optStyle = "bg-red-500/10 border-red-500/50 text-red-400 ring-1 ring-red-500/30";
                     icon = <svg className="w-6 h-6 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>;
                     badges.push(<span key="wrong" className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-red-500/20 text-red-400">LỰA CHỌN SAI CỦA BẠN</span>);
                  } else if (!isUserSelection && isActualCorrect) {
                     optStyle = "bg-blue-500/10 border-blue-500/50 text-blue-400 border-dashed border-2";
                     icon = <svg className="w-6 h-6 shrink-0 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>;
                     badges.push(<span key="missed" className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-blue-500/20 text-blue-400">ĐÁP ÁN ĐÚNG CỦA CÂU HỎI</span>);
                  }

                  return (
                    <div key={oIdx} className={`border rounded-2xl p-4 flex items-start gap-4 transition-all ${optStyle}`}>
                      <div className="flex-1">
                        <span className={`text-base md:text-lg block mb-1 ${isActualCorrect ? 'font-semibold' : ''}`}>{opt}</span>
                        {badges.length > 0 && <div className="mt-2 flex gap-2">{badges}</div>}
                      </div>
                      <div className="mt-1">
                        {icon && icon}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
                 <div className="flex items-center text-blue-400 font-bold mb-3 text-sm uppercase tracking-wider">
                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   Explanation
                 </div>
                 <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                   {q.explanation}
                 </p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
