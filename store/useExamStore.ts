import { create } from 'zustand';

export type ExamConfig = {
  mode: 'chapter' | 'cumulative' | 'ai' | 'predefined';
  chapters?: number[];
  questionCount: number;
  timeLimit?: number; // duration in minutes
  difficulty?: 'easy' | 'normal' | 'hard' | 'mixed'; // for AI mode
  chapterDistribution?: Record<number, number>; // Maps chapter to question count for custom cumulative
  predefinedExam?: string;
  isExamOnly?: boolean;
};

export type QuestionReference = {
  questionNumber: number | string;
  examName: string;
};

export type Question = {
  id: string;
  chapter: number;
  difficulty: "easy" | "normal" | "hard";
  questionText: string;
  options: string[];
  correctAnswer: string | string[];
  explanation: string;
  imageUrl?: string;
  type?: 'single' | 'multiple';
  reference?: QuestionReference;
};

export type ExamState = 'idle' | 'running' | 'submitted';

export interface AppState {
  examConfig: ExamConfig | null;
  examState: ExamState;
  
  // Real-time exam session data
  examQuestions: Question[];
  userAnswers: Record<string, string | string[]>; // Maps questionId to selected option(s)
  timeRemaining: number; // in seconds
  
  // Actions
  setExamConfig: (config: ExamConfig) => void;
  startExam: () => void;
  submitExam: () => void;
  resetExam: () => void;
  setExamQuestions: (questions: Question[]) => void;
  setAnswer: (questionId: string, answer: string) => void;
  setTimeRemaining: (seconds: number) => void;
}

export const useExamStore = create<AppState>((set) => ({
  examConfig: null,
  examState: 'idle',
  examQuestions: [],
  userAnswers: {},
  timeRemaining: 0,
  
  setExamConfig: (config) => set({ examConfig: config, timeRemaining: (config.timeLimit || 0) * 60 }),
  startExam: () => set({ examState: 'running', userAnswers: {}, examQuestions: [] }),
  submitExam: () => set({ examState: 'submitted' }),
  resetExam: () => set({ examConfig: null, examState: 'idle', examQuestions: [], userAnswers: {}, timeRemaining: 0 }),
  
  setExamQuestions: (questions) => set({ examQuestions: questions }),
  setAnswer: (questionId, answer) => set((state) => {
    const question = state.examQuestions.find(q => q.id === questionId);
    if (question?.type === 'multiple') {
      const currentAnswers = (state.userAnswers[questionId] as string[]) || [];
      const newAnswers = currentAnswers.includes(answer as string)
        ? currentAnswers.filter(a => a !== answer)
        : [...currentAnswers, answer as string];
      return {
        userAnswers: { ...state.userAnswers, [questionId]: newAnswers }
      };
    }
    return {
      userAnswers: { ...state.userAnswers, [questionId]: answer }
    };
  }),
  setTimeRemaining: (seconds) => set({ timeRemaining: seconds }),
}));
