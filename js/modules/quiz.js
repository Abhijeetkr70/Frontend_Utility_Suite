import store from './store.js';
import toast from './toast.js';
import modal from './modal.js';
import { fireConfetti } from './confetti.js';

const QUIZ_KEY = 'quizHistory';

const TOPICS = [
  {
    id: 'frontend',
    name: 'Frontend Development',
    icon: 'code',
    questions: [
      {
        question: 'What does the "C" in CSS stand for?',
        options: ['Cascading', 'Coding', 'Creative', 'Computer'],
        answer: 0, difficulty: 'easy'
      },
      {
        question: 'Which method adds an element to the end of an array?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        answer: 0, difficulty: 'easy'
      },
      {
        question: 'What HTML element inserts a line break?',
        options: ['<br>', '<break>', '<lb>', '<hr>'],
        answer: 0, difficulty: 'easy'
      },
      {
        question: 'Which CSS property changes background color?',
        options: ['background-color', 'color', 'bgcolor', 'background'],
        answer: 0, difficulty: 'easy'
      },
      {
        question: 'What does DOM stand for?',
        options: ['Document Object Model', 'Data Object Model', 'Document Orientation Model', 'Digital Output Method'],
        answer: 0, difficulty: 'easy'
      },
      {
        question: 'Which keyword declares a constant in JS?',
        options: ['const', 'let', 'var', 'static'],
        answer: 0, difficulty: 'easy'
      },
      {
        question: 'What composes the CSS box model?',
        options: ['Content, Padding, Border, Margin', 'Content, Margin, Padding, Outline', 'Width, Height, Padding, Border', 'Content, Border, Outline, Margin'],
        answer: 0, difficulty: 'medium'
      },
      {
        question: 'What does `Array.map()` return?',
        options: ['A new array', 'The original array modified', 'A boolean', 'An object'],
        answer: 0, difficulty: 'medium'
      },
      {
        question: 'Which property creates a flex container?',
        options: ['display: flex', 'display: block', 'display: inline', 'position: flex'],
        answer: 0, difficulty: 'medium'
      },
      {
        question: 'What is event delegation?',
        options: ['Handling events at a parent', 'Events on every element', 'Removing listeners', 'Creating custom events'],
        answer: 0, difficulty: 'medium'
      },
      {
        question: 'Which HTML tag is used for JavaScript?',
        options: ['<script>', '<javascript>', '<js>', '<code>'],
        answer: 0, difficulty: 'medium'
      },
      {
        question: 'Which method prevents form submission?',
        options: ['preventDefault()', 'stopPropagation()', 'stopImmediate()', 'cancelSubmit()'],
        answer: 0, difficulty: 'medium'
      },
      {
        question: 'What is the Virtual DOM?',
        options: ['A lightweight copy of the real DOM', 'A browser API', 'A framework', 'A CSS preprocessor'],
        answer: 0, difficulty: 'hard'
      },
      {
        question: 'What does CORS stand for?',
        options: ['Cross-Origin Resource Sharing', 'Cross-Origin Request Security', 'Cross-Object Resource Sharing', 'Centralized Origin Response System'],
        answer: 0, difficulty: 'hard'
      },
      {
        question: 'What is a closure in JavaScript?',
        options: ['Function with outer scope access', 'A closed function', 'An anonymous function', 'A callback'],
        answer: 0, difficulty: 'hard'
      }
    ]
  },
  {
    id: 'general',
    name: 'General Trivia',
    icon: 'globe',
    questions: [
      {
        question: 'What is the capital of France?',
        options: ['Paris', 'London', 'Berlin', 'Madrid'],
        answer: 0, difficulty: 'easy'
      },
      {
        question: 'How many continents are there?',
        options: ['7', '5', '6', '8'],
        answer: 0, difficulty: 'easy'
      },
      {
        question: 'Largest planet in our solar system?',
        options: ['Jupiter', 'Saturn', 'Mars', 'Neptune'],
        answer: 0, difficulty: 'easy'
      },
      {
        question: 'Chemical symbol for water?',
        options: ['H2O', 'CO2', 'NaCl', 'O2'],
        answer: 0, difficulty: 'easy'
      },
      {
        question: 'Who painted the Mona Lisa?',
        options: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Donatello'],
        answer: 0, difficulty: 'easy'
      },
      {
        question: 'Speed of light approximately?',
        options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '100,000 km/s'],
        answer: 0, difficulty: 'medium'
      },
      {
        question: 'Element with atomic number 1?',
        options: ['Hydrogen', 'Helium', 'Lithium', 'Oxygen'],
        answer: 0, difficulty: 'medium'
      },
      {
        question: 'What year did WWII end?',
        options: ['1945', '1944', '1946', '1943'],
        answer: 0, difficulty: 'medium'
      },
      {
        question: 'Smallest country in the world?',
        options: ['Vatican City', 'Monaco', 'San Marino', 'Liechtenstein'],
        answer: 0, difficulty: 'medium'
      },
      {
        question: 'Powerhouse of the cell?',
        options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Golgi apparatus'],
        answer: 0, difficulty: 'medium'
      },
      {
        question: 'Hardest natural substance?',
        options: ['Diamond', 'Gold', 'Platinum', 'Quartz'],
        answer: 0, difficulty: 'hard'
      },
      {
        question: 'Longest river in the world?',
        options: ['Nile', 'Amazon', 'Mississippi', 'Yangtze'],
        answer: 0, difficulty: 'hard'
      },
      {
        question: 'Boiling point of water in °F?',
        options: ['212°F', '100°F', '180°F', '250°F'],
        answer: 0, difficulty: 'hard'
      },
      {
        question: 'Rarest blood type?',
        options: ['AB-', 'O-', 'B+', 'A-'],
        answer: 0, difficulty: 'hard'
      },
      {
        question: 'pH level of pure water?',
        options: ['7', '5', '9', '3'],
        answer: 0, difficulty: 'hard'
      }
    ]
  }
];

let quizState = {
  topic: null,
  difficulty: null,
  questions: [],
  currentIndex: 0,
  score: 0,
  answers: [],
  timer: null,
  timePerQuestion: 15,
  timeRemaining: 15,
  isActive: false,
  startTime: null
};

function renderQuiz() {
  const app = document.getElementById('app-content');
  const history = store.get(QUIZ_KEY, []);
  const showResults = quizState.questions.length > 0 && quizState.currentIndex >= quizState.questions.length;

  app.innerHTML = `
    <div class="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Quiz Platform</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-1">${showResults ? 'Quiz complete!' : quizState.isActive ? 'Answer questions against the clock' : 'Test your knowledge across topics'}</p>
        </div>
      </div>

      ${showResults ? renderResultsScreen() : (quizState.isActive ? renderQuizScreen() : renderWelcomeScreen())}

      ${!quizState.isActive && history.length ? renderHistoryTable(history) : ''}
    </div>
  `;

  attachQuizListeners();

  if (showResults) {
    const accuracy = quizState.questions.length ? Math.round((quizState.score / quizState.questions.length) * 100) : 0;
    if (accuracy === 100) setTimeout(fireConfetti, 300);
  }
}

function renderHistoryTable(history) {
  return `
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Past Performance</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th class="pb-3 pr-4">Date</th>
              <th class="pb-3 pr-4">Topic</th>
              <th class="pb-3 pr-4">Difficulty</th>
              <th class="pb-3 pr-4">Score</th>
              <th class="pb-3 pr-4">Accuracy</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
            ${history.map(h => `
              <tr class="text-slate-600 dark:text-slate-400">
                <td class="py-3 pr-4 whitespace-nowrap">${new Date(h.date).toLocaleDateString()}</td>
                <td class="py-3 pr-4">${h.topic}</td>
                <td class="py-3 pr-4 capitalize">${h.difficulty}</td>
                <td class="py-3 pr-4 font-medium text-slate-900 dark:text-white">${h.score}/${h.total}</td>
                <td class="py-3 pr-4">
                  <span class="inline-flex items-center gap-1 ${h.accuracy >= 80 ? 'text-emerald-500' : h.accuracy >= 50 ? 'text-amber-500' : 'text-red-500'}">
                    ${h.accuracy}%
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${h.accuracy >= 80 ? 'M5 10l7 7 9-11' : h.accuracy >= 50 ? 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' : 'M6 18L18 6M6 6l12 12'}"/></svg>
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderWelcomeScreen() {
  return `
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-6">Start a New Quiz</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        ${TOPICS.map(t => `
          <button class="topic-card p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 text-left transition-all hover:shadow-md bg-white dark:bg-slate-800/50 ${quizState.topic === t.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : ''}" data-topic="${t.id}">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${t.id === 'frontend' ? 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' : 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'}"/></svg>
              </div>
              <div>
                <p class="font-semibold text-slate-900 dark:text-white">${t.name}</p>
                <p class="text-xs text-slate-400">${t.questions.length} questions</p>
              </div>
            </div>
          </button>
        `).join('')}
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Difficulty</label>
        <div class="flex gap-3">
          ${['easy', 'medium', 'hard'].map(d => `
            <button class="difficulty-chip flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border-2 ${quizState.difficulty === d ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'} capitalize" data-difficulty="${d}">${d}</button>
          `).join('')}
        </div>
      </div>

      <button id="start-quiz-btn" class="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors shadow-sm ${quizState.topic && quizState.difficulty ? '' : 'opacity-50 cursor-not-allowed'}" ${quizState.topic && quizState.difficulty ? '' : 'disabled'}>
        Start Quiz
      </button>
    </div>
  `;
}

function renderQuizScreen() {
  const q = quizState.questions[quizState.currentIndex];
  if (!q) return renderResultsScreen();

  const progress = ((quizState.currentIndex) / quizState.questions.length) * 100;
  const timePercent = (quizState.timeRemaining / quizState.timePerQuestion) * 100;
  const isLowTime = quizState.timeRemaining <= 5;

  return `
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-medium text-slate-500 dark:text-slate-400">Question ${quizState.currentIndex + 1} of ${quizState.questions.length}</span>
        <span class="text-sm font-medium text-slate-500 dark:text-slate-400">Score: ${quizState.score}</span>
      </div>

      <div class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full mb-6">
        <div class="h-full bg-indigo-500 rounded-full transition-all duration-500" style="width: ${progress}%"></div>
      </div>

      <div class="flex items-center justify-center mb-6">
        <div class="relative w-16 h-16">
          <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" stroke-width="3" class="text-slate-200 dark:text-slate-700"/>
            <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="100" stroke-dashoffset="${100 - timePercent}" class="${isLowTime ? 'text-red-500' : 'text-indigo-500'} transition-all duration-1000"/>
          </svg>
          <span class="absolute inset-0 flex items-center justify-center text-lg font-bold ${isLowTime ? 'text-red-500' : 'text-slate-900 dark:text-white'}">${quizState.timeRemaining}</span>
        </div>
      </div>

      <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-6 text-center">${q.question}</h3>

      <div class="space-y-3 max-w-xl mx-auto">
        ${q.options.map((opt, i) => {
          const answered = quizState.answers[quizState.currentIndex];
          let classes = 'w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ';
          if (answered !== undefined) {
            if (i === q.answer) classes += 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 ';
            else if (answered === i) classes += 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 ';
            else classes += 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 opacity-50 ';
          } else {
            classes += 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer ';
          }
          return `<button class="quiz-option ${classes}" data-index="${i}" ${answered !== undefined ? 'disabled' : ''}>${opt}</button>`;
        }).join('')}
      </div>
    </div>
  `;
}

function renderResultsScreen() {
  const total = quizState.questions.length;
  const accuracy = total ? Math.round((quizState.score / total) * 100) : 0;
  const timeTaken = Math.round((Date.now() - quizState.startTime) / 1000);
  const mins = Math.floor(timeTaken / 60);
  const secs = timeTaken % 60;

  const result = {
    date: Date.now(),
    topic: TOPICS.find(t => t.id === quizState.topic)?.name || '',
    difficulty: quizState.difficulty,
    score: quizState.score,
    total,
    accuracy,
    timeTaken
  };

  const history = store.get(QUIZ_KEY, []);
  history.unshift(result);
  if (history.length > 20) history.length = 20;
  store.set(QUIZ_KEY, history);

  const isGood = accuracy >= 80;
  const isOk = accuracy >= 50;

  return `
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 text-center max-w-lg mx-auto">
      <div class="w-20 h-20 mx-auto mb-4 rounded-full ${isGood ? 'bg-emerald-100 dark:bg-emerald-900/30' : isOk ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-red-100 dark:bg-red-900/30'} flex items-center justify-center">
        <svg class="w-10 h-10 ${isGood ? 'text-emerald-500' : isOk ? 'text-amber-500' : 'text-red-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${isGood ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : isOk ? 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' : 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'}"/></svg>
      </div>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">${isGood ? 'Excellent!' : isOk ? 'Good Effort!' : 'Keep Practicing!'}</h2>
      <p class="text-slate-500 dark:text-slate-400 mb-6">${TOPICS.find(t => t.id === quizState.topic)?.name} · ${quizState.difficulty} difficulty</p>

      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
          <p class="text-2xl font-bold text-slate-900 dark:text-white">${quizState.score}/${total}</p>
          <p class="text-xs text-slate-400">Score</p>
        </div>
        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
          <p class="text-2xl font-bold ${isGood ? 'text-emerald-500' : isOk ? 'text-amber-500' : 'text-red-500'}">${accuracy}%</p>
          <p class="text-xs text-slate-400">Accuracy</p>
        </div>
        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
          <p class="text-2xl font-bold text-slate-900 dark:text-white">${mins}:${secs.toString().padStart(2, '0')}</p>
          <p class="text-xs text-slate-400">Time</p>
        </div>
      </div>

      <p class="text-sm text-slate-400 dark:text-slate-500 mb-6">${result.date ? `Completed ${new Date(result.date).toLocaleTimeString()}` : ''}</p>

      <button id="play-again-btn" class="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors shadow-sm">Play Again</button>
    </div>
  `;
}

function attachQuizListeners() {
  const container = document.getElementById('app-content');

  container.addEventListener('click', (e) => {
    const topicCard = e.target.closest('.topic-card');
    if (topicCard) {
      quizState.topic = topicCard.dataset.topic;
      renderQuiz();
    }

    const diffChip = e.target.closest('.difficulty-chip');
    if (diffChip) {
      quizState.difficulty = diffChip.dataset.difficulty;
      renderQuiz();
    }

    if (e.target.id === 'start-quiz-btn' || e.target.closest('#start-quiz-btn')) {
      if (quizState.topic && quizState.difficulty) startQuiz();
    }

    if (e.target.id === 'play-again-btn' || e.target.closest('#play-again-btn')) {
      quizState.isActive = false;
      renderQuiz();
    }

    const option = e.target.closest('.quiz-option');
    if (option && !option.disabled) {
      handleAnswer(parseInt(option.dataset.index));
    }
  });
}

function startQuiz() {
  const topic = TOPICS.find(t => t.id === quizState.topic);
  if (!topic) return;

  let questions = [...topic.questions];
  if (quizState.difficulty !== 'all') {
    questions = questions.filter(q => q.difficulty === quizState.difficulty);
  }
  if (questions.length < 5) questions = [...topic.questions].sort(() => Math.random() - 0.5).slice(0, 10);

  questions = questions.sort(() => Math.random() - 0.5).slice(0, Math.min(questions.length, 10));

  quizState.questions = questions;
  quizState.currentIndex = 0;
  quizState.score = 0;
  quizState.answers = [];
  quizState.isActive = true;
  quizState.startTime = Date.now();
  quizState.timePerQuestion = quizState.difficulty === 'easy' ? 20 : quizState.difficulty === 'medium' ? 15 : 10;
  quizState.timeRemaining = quizState.timePerQuestion;

  renderQuiz();
  startTimer();
}

function startTimer() {
  if (quizState.timer) clearInterval(quizState.timer);
  quizState.timer = setInterval(() => {
    quizState.timeRemaining--;
    updateTimerUI();
    if (quizState.timeRemaining <= 0) {
      handleTimeout();
    }
  }, 1000);
}

function updateTimerUI() {
  const timerEl = document.querySelector('.relative.w-16.h-16');
  if (!timerEl) return;
  const circle = timerEl.querySelector('circle:last-child');
  const text = timerEl.querySelector('span');
  if (circle) {
    const timePercent = (quizState.timeRemaining / quizState.timePerQuestion) * 100;
    circle.style.strokeDashoffset = 100 - timePercent;
    circle.classList.toggle('text-red-500', quizState.timeRemaining <= 5);
    circle.classList.toggle('text-indigo-500', quizState.timeRemaining > 5);
  }
  if (text) {
    text.textContent = quizState.timeRemaining;
    text.classList.toggle('text-red-500', quizState.timeRemaining <= 5);
    text.classList.toggle('text-slate-900', quizState.timeRemaining > 5);
    text.classList.toggle('dark:text-white', quizState.timeRemaining > 5);
  }
}

function handleTimeout() {
  clearInterval(quizState.timer);
  quizState.answers[quizState.currentIndex] = -1;
  advanceQuestion();
}

function handleAnswer(index) {
  clearInterval(quizState.timer);
  const q = quizState.questions[quizState.currentIndex];
  quizState.answers[quizState.currentIndex] = index;

  if (index === q.answer) {
    quizState.score++;
  }

  advanceQuestion();
}

function advanceQuestion() {
  const total = quizState.questions.length;
  quizState.currentIndex++;

  if (quizState.currentIndex >= total) {
    quizState.isActive = false;
    clearInterval(quizState.timer);
    renderQuiz();
  } else {
    quizState.timeRemaining = quizState.timePerQuestion;
    renderQuiz();
    startTimer();
  }
}

function renderQuizPlatform() {
  quizState.isActive = false;
  clearInterval(quizState.timer);
  renderQuiz();
}

function cleanupQuiz() {
  clearInterval(quizState.timer);
  quizState.isActive = false;
  quizState.timer = null;
}

export { renderQuizPlatform, cleanupQuiz };
