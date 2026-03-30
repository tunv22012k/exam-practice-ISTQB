const fs = require('fs');
const path = require('path');
const all = [];
for (let i = 1; i <= 6; i++) {
  const file = path.join(__dirname, `data/chapter${i}.json`);
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    all.push(...data);
  }
}
const exams = [...new Set(all.map(q => q.reference?.examName).filter(Boolean))];
console.log(exams);
