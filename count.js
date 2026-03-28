const fs = require('fs');
for (let i = 1; i <= 6; i++) {
  try {
    const data = JSON.parse(fs.readFileSync('./data/chapter' + i + '.json', 'utf8'));
    console.log('Chapter ' + i + ': ' + data.length);
  } catch (e) {
    console.log('Chapter ' + i + ': Error');
  }
}
