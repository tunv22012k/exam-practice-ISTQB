"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useExamStore, Question } from '../../store/useExamStore';
import allQuestionsRaw from '../../data/index';

const allQuestions = allQuestionsRaw as Question[];
console.log(`Loaded ${allQuestions.length} total questions. Chapter 1 has: ${allQuestions.filter(q => q.chapter === 1).length}`);

// Utility to shuffle an array securely
function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length, randomIndex;
  const result = [...array];
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [result[currentIndex], result[randomIndex]] = [result[randomIndex], result[currentIndex]];
  }
  return result;
}

export default function ExamPage() {
  const router = useRouter();
  const {
    examConfig,
    examState,
    examQuestions,
    userAnswers,
    timeRemaining,
    setExamQuestions,
    setAnswer,
    setTimeRemaining,
    submitExam
  } = useExamStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);

  // Auto Submit handler wrap
  const handleAutoSubmit = useCallback(() => {
    submitExam();
    router.push('/result');
  }, [submitExam, router]);

  // Initialization: Generate Exam Questions based on Config
  useEffect(() => {
    if (!examConfig || examState === 'idle') {
      router.push('/');
      return;
    }

    // Only generate if we haven't already generated for this session
    // This prevents re-shuffling on hot reloads or re-renders
    if (examQuestions.length === 0) {
      let selectedQuestions: Question[] = [];

      if (examConfig.mode === 'chapter' && examConfig.chapters) {
        const pool = allQuestions.filter(q => examConfig.chapters?.includes(q.chapter));
        selectedQuestions = shuffle(pool).slice(0, examConfig.questionCount);
      }
      else if (examConfig.mode === 'cumulative') {
        if (examConfig.chapterDistribution) {
          // Custom setup
          Object.entries(examConfig.chapterDistribution).forEach(([ch, count]) => {
            const pool = allQuestions.filter(q => q.chapter === parseInt(ch));
            selectedQuestions.push(...shuffle(pool).slice(0, count));
          });
          // Final shuffle to mix chapters
          selectedQuestions = shuffle(selectedQuestions);
        } else {
          // Quick Start setup
          selectedQuestions = shuffle(allQuestions).slice(0, examConfig.questionCount);
        }
      }
      else if (examConfig.mode === 'ai') {
        let pool = allQuestions;
        if (examConfig.difficulty && examConfig.difficulty !== 'mixed') {
          pool = allQuestions.filter(q => q.difficulty === examConfig.difficulty);
        }
        selectedQuestions = shuffle(pool).slice(0, examConfig.questionCount);
      }

      // Just in case we run out of questions in DB
      if (selectedQuestions.length === 0) {
        alert("No questions found for the selected configuration. Using available questions.");
        selectedQuestions = shuffle(allQuestions).slice(0, examConfig.questionCount || 10);
      }

      setExamQuestions(selectedQuestions);
    }
    setIsInitializing(false);
  }, [examConfig, examState, router, examQuestions.length, setExamQuestions]);

  // Timer logic
  useEffect(() => {
    if (isInitializing || examState !== 'running') return;

    // Ensure timer doesn't run infinitely if it was 0
    if (timeRemaining <= 0) {
      handleAutoSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, isInitializing, examState, setTimeRemaining, handleAutoSubmit]);

  const currentQuestion = useMemo(() => examQuestions[currentIndex] || null, [examQuestions, currentIndex]);

  const handleOptionSelect = (option: string) => {
    if (currentQuestion) {
      setAnswer(currentQuestion.id, option);
    }
  };

  const handleNext = () => {
    if (currentIndex < examQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleManualSubmit = () => {
    if (window.confirm('Are you sure you want to finish and submit the exam?')) {
      submitExam();
      router.push('/result');
    }
  };

  // Time formatter
  const formatTime = (seconds: number) => {
    if (seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isInitializing || examQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
      </div>
    );
  }

  const isAnswered = (qId: string) => userAnswers[qId] !== undefined;

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row overflow-hidden">

      {/* Sidebar / Grid */}
      <aside className="w-full md:w-80 bg-slate-800/80 border-r border-slate-700 p-6 flex flex-col h-auto md:h-screen shrink-0 relative z-20 shadow-xl">
        <div className="mb-8">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
            ISTQB Exam Session
          </h2>
          <div className="flex items-center space-x-2 text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
            <svg className={`w-5 h-5 ${timeRemaining < 300 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className={`font-mono text-xl font-bold tracking-wider ${timeRemaining < 300 ? 'text-red-400' : 'text-white'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-1 -mx-1 pb-10">
          <div className="flex justify-between items-center mb-4 text-sm font-medium text-slate-400 px-1">
            <span>Questions Grid</span>
            <span className="bg-slate-700 px-2 py-1 rounded text-xs">{Object.keys(userAnswers).length} / {examQuestions.length}</span>
          </div>
          <div className="grid grid-cols-5 gap-2 p-1">
            {examQuestions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm transition-all duration-300
                  ${currentIndex === idx ? 'ring-2 ring-white scale-110 shadow-lg z-10' : ''}
                  ${isAnswered(q.id)
                    ? (currentIndex === idx ? 'bg-blue-600' : 'bg-blue-500/80 text-white hover:bg-blue-400')
                    : (currentIndex === idx ? 'bg-slate-600' : 'bg-slate-700 hover:bg-slate-600 text-slate-300')}
                `}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-700">
          <button
            onClick={handleManualSubmit}
            className="w-full py-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/30 flex justify-center items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Submit Exam
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 p-4 md:pb-10 h-screen overflow-y-auto relative bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto mt-6">

          {/* Question header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-white/10">
            <span className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-2 md:mb-0">
              Question {currentIndex + 1} of {examQuestions.length}
            </span>
            <div className="flex space-x-3 text-xs font-medium">
              <span className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full">Chapter {currentQuestion?.chapter}</span>
              {examConfig?.mode !== 'chapter' && (
                <span className={`px-3 py-1.5 rounded-full border ${currentQuestion?.difficulty === 'easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' : currentQuestion?.difficulty === 'hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                  Difficulty: <span className="capitalize">{currentQuestion?.difficulty}</span>
                </span>
              )}
            </div>
          </div>

          {/* Question Text */}
          <h1 className="text-xl md:text-2xl font-medium leading-relaxed mb-6 animate-fade-in-up whitespace-pre-wrap">
            {currentQuestion?.questionText}
          </h1>

          {currentQuestion?.imageUrl && (
            <div className="mb-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-fade-in-up">
              <img 
                src={currentQuestion.imageUrl} 
                alt="Question illustration" 
                className="max-h-[400px] object-contain mx-auto"
              />
            </div>
          )}

          {/* Options List */}
          <div className="space-y-4 mb-20">
            {currentQuestion?.options.map((option, idx) => {
              const uAns = userAnswers[currentQuestion.id];
              const qType = currentQuestion?.type;
              const isSelected = qType === 'multiple'
                ? (Array.isArray(uAns) && uAns.includes(option))
                : uAns === option;
                return (
                  <label
                  key={idx}
                  className={`
                      group flex items-start p-5 rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-sm
                      ${isSelected
                      ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-lg'}
                    `}
                >
                  <div className="flex items-center h-6 mr-4">
                    <div className={`
                        w-6 h-6 rounded-${qType === 'multiple' ? 'md' : 'full'} border-2 flex items-center justify-center transition-all duration-300
                        ${isSelected ? 'border-blue-400' : 'border-slate-500 group-hover:border-slate-400'}
                      `}>
                      {isSelected && (
                        <div className={qType === 'multiple' ? "" : "w-3 h-3 bg-blue-400 rounded-full animate-bounce-short"}>
                          {qType === 'multiple' && (
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <input
                    type={qType === 'multiple' ? "checkbox" : "radio"}
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={isSelected}
                    onChange={() => handleOptionSelect(option)}
                    className="hidden"
                  />

                  <div className="flex flex-col">
                    <span className={`text-lg transition-colors ${isSelected ? 'text-white font-medium' : 'text-slate-300'}`}>
                      {option}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Bottom Navigation Navbar */}
          <div className="fixed bottom-0 left-0 md:left-80 right-0 p-6 bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/50 flex justify-between items-center z-10 transition-all">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`
                  px-6 py-3 rounded-xl font-medium flex items-center transition-all
                  ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed text-slate-500' : 'text-slate-300 hover:text-white hover:bg-white/10 bg-white/5'}
                `}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Previous
            </button>

            <div className="text-slate-400 font-medium text-sm hidden sm:block">
              {Math.round(((currentIndex + 1) / examQuestions.length) * 100)}% Completed
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex === examQuestions.length - 1}
              className={`
                  px-8 py-3 rounded-xl font-bold flex items-center transition-all shadow-lg
                  ${currentIndex === examQuestions.length - 1
                  ? 'opacity-30 cursor-not-allowed bg-slate-700 text-slate-400'
                  : 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-blue-500/25'}
                `}
            >
              Next
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

        </div>
      </section>

    </main>
  );
}
