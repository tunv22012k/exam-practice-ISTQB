import chapter1 from './chapter1.json';
import chapter2 from './chapter2.json';
import chapter3 from './chapter3.json';
import chapter4 from './chapter4.json';
import chapter5 from './chapter5.json';
import chapter6 from './chapter6.json';

// Some files might be empty or array
const safeArray = (arr: any) => Array.isArray(arr) ? arr : [];

export const allExamQuestions = [
  ...safeArray(chapter1),
  ...safeArray(chapter2),
  ...safeArray(chapter3),
  ...safeArray(chapter4),
  ...safeArray(chapter5),
  ...safeArray(chapter6),
];

export default allExamQuestions;
