const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'chapter1.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

data.forEach(q => {
  if (q.id === 'q115') {
    q.questionText = "The following statements relate to activities that are part of the fundamental test process.\ni. Evaluating the testability of requirements.\nii. Repeating testing activities after changes.\niii. Designing the test environment set-up.\niv. Developing and prioritizing test cases.\nv. Verifying the environment is set up correctly.\nWhich statement below is TRUE?";
  }
  if (q.id === 'q117') {
    q.questionText = "Which of the following are valid justifications for developers testing their own code during unit testing?\n(i) Their lack of independence is mitigated by independent testing during system and acceptance testing.\n(ii) A person with a good understanding of the code can find more defects more quickly using white-box techniques.\n(iii) Developers have a better understanding of the requirements than testers.\n(iv) Testers write unnecessary incident reports because they find minor differences between the way in which the system behaves and the way in which it is specified to work.";
  }
  if (q.id === 'q104') {
    q.questionText = "Which of the following are benefits of an independent test team, and which are drawbacks?\na) Independent testers can find different defects.\nb) Developers may put less emphasis on quality.\nc) Independent testers can be seen as the reason for delayed projects.\nd) Independent testers can verify assumptions made during the specification of a system";
  }
  if (q.id === 'q123') {
    q.questionText = "The list below (a to e) describes one major task for each of the five main activities of the fundamental test process. Which option (A to D) places the tasks in the correct order, by time?\na) Create bi-directional traceability between test basis and test cases.\nb) Check test logs against exit criteria.\nc) Define the objectives of testing.\nd) Check planned deliverables have been delivered.\ne) Comparing actual results with expected results.";
  }
  if (q.id === 'q124') {
    q.questionText = "Which of the following are DEBUGGING activities?\na) Designing tests to find failures.\nb) Locating the cause of failures.\nc) Analysing and fixing the defects.\nd) Executing tests to show failures.";
  }
  if (q.id === 'q125') {
    q.questionText = "Which of the following are TESTING activities?\na) Designing tests to find failures.\nb) Locating the cause of failures.\nc) Analysing and fixing the defects.\nd) Executing tests to show failures.";
  }
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Fixed questions text format');
