const fs = require('fs');
const path = require('path');

const newQuestions = JSON.parse(fs.readFileSync(path.join(__dirname, 'new_questions.json'), 'utf8'));
const oldQuestions = JSON.parse(fs.readFileSync(path.join(__dirname, 'questions.json'), 'utf8'));

const all = [...oldQuestions.filter(q => q.chapter !== 1), ...newQuestions];
const byChapter = {};
all.forEach(q => {
    if (!byChapter[q.chapter]) byChapter[q.chapter] = [];
    byChapter[q.chapter].push(q);
});

Object.keys(byChapter).forEach(ch => {
    fs.writeFileSync(path.join(__dirname, `chapter${ch}.json`), JSON.stringify(byChapter[ch], null, 2));
});

let indexTs = '';
Object.keys(byChapter).forEach(ch => {
    indexTs += `import chapter${ch} from './chapter${ch}.json';\n`;
});
indexTs += `\nexport const allQuestions = [\n`;
Object.keys(byChapter).forEach(ch => {
    indexTs += `  ...chapter${ch},\n`;
});
indexTs += `];\nexport default allQuestions;\n`;

fs.writeFileSync(path.join(__dirname, 'index.ts'), indexTs);
console.log('Done splitting!');
