import store from './store.js';
import toast from './toast.js';

function renderDashboard() {
  const tasks = store.get('tasks', []);
  const weatherHistory = store.get('weatherHistory', []);
  const quizHistory = store.get('quizHistory', []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length;

  const avgAccuracy = quizHistory.length
    ? Math.round(quizHistory.reduce((s, q) => s + q.accuracy, 0) / quizHistory.length)
    : 0;

  const lastCity = weatherHistory.length ? weatherHistory[0] : null;

  const app = document.getElementById('app-content');
  app.innerHTML = `
    <div class="p-6 max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-1">Welcome to your Frontend Utility Suite</p>
        </div>
        <div class="hidden sm:flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          All systems operational
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        ${statCard('clipboard-list', 'Total Tasks', totalTasks, 'text-slate-900 dark:text-white', totalTasks ? '' : 'No tasks yet')}
        ${statCard('check-circle', 'Completed', completedTasks, 'text-emerald-500', completedTasks === totalTasks && totalTasks > 0 ? 'All done!' : `${((totalTasks ? completedTasks/totalTasks*100 : 0)).toFixed(0)}% done`)}
        ${statCard('clock', 'Pending', pendingTasks, 'text-amber-500', highPriority > 0 ? `${highPriority} high priority` : 'All clear')}
        ${statCard('brain', 'Avg Accuracy', quizHistory.length ? `${avgAccuracy}%` : '--', 'text-indigo-500', quizHistory.length ? `${quizHistory.length} quizzes taken` : 'No data yet')}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
          <div class="grid grid-cols-2 gap-3">
            <a href="#/tasks" class="flex flex-col items-center gap-2 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
              <span class="text-sm font-medium">Task Manager</span>
            </a>
            <a href="#/weather" class="flex flex-col items-center gap-2 p-4 rounded-xl bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
              <span class="text-sm font-medium">Weather</span>
            </a>
            <a href="#/quiz" class="flex flex-col items-center gap-2 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
              <span class="text-sm font-medium">Quiz</span>
            </a>
            <button onclick="document.getElementById('theme-toggle')?.click()" class="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
              <span class="text-sm font-medium">Toggle Theme</span>
            </button>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Data Management</h2>
          <div class="space-y-3">
            <p class="text-xs text-slate-500 dark:text-slate-400">Export your data as a JSON backup or restore from a previous backup.</p>
            <button id="export-data-btn" class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Export Data
            </button>
            <label class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors cursor-pointer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L5 8m4-4v12"/></svg>
              Import Data
              <input type="file" id="import-data-input" accept=".json" class="hidden">
            </label>
            <button id="clear-data-btn" class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              Clear All Data
            </button>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
          <div class="space-y-3">
            ${lastCity ? `
              <div class="flex items-center gap-3 p-3 rounded-lg bg-sky-50 dark:bg-sky-900/20">
                <svg class="w-5 h-5 text-sky-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Last weather search</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 truncate">${lastCity}</p>
                </div>
              </div>
            ` : ''}
            ${quizHistory.length ? `
              <div class="flex items-center gap-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20">
                <svg class="w-5 h-5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Last quiz score</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 truncate">${quizHistory[0].accuracy}% accuracy on ${quizHistory[0].topic}</p>
                </div>
              </div>
            ` : ''}
            ${tasks.length ? `
              <div class="flex items-center gap-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                <svg class="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Task summary</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">${completedTasks}/${totalTasks} completed</p>
                </div>
              </div>
            ` : `
              <p class="text-sm text-slate-400 dark:text-slate-500 text-center py-4">No activity yet. Start by adding a task, checking the weather, or taking a quiz!</p>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
  attachDashboardListeners();
}

function attachDashboardListeners() {
  document.getElementById('export-data-btn')?.addEventListener('click', exportData);
  document.getElementById('import-data-input')?.addEventListener('change', importData);
  document.getElementById('clear-data-btn')?.addEventListener('click', clearAllData);
}

function exportData() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    tasks: store.get('tasks', []),
    weatherHistory: store.get('weatherHistory', []),
    weatherApiKey: store.get('weatherApiKey', ''),
    quizHistory: store.get('quizHistory', []),
    theme: store.get('theme', 'dark')
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fe-utils-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('Data exported successfully');
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (!data.version) throw new Error('Invalid backup file');
      if (data.tasks) store.set('tasks', data.tasks);
      if (data.weatherHistory) store.set('weatherHistory', data.weatherHistory);
      if (data.weatherApiKey) store.set('weatherApiKey', data.weatherApiKey);
      if (data.quizHistory) store.set('quizHistory', data.quizHistory);
      if (data.theme) store.set('theme', data.theme);
      toast.success('Data imported successfully! Refreshing...');
      setTimeout(() => location.reload(), 1500);
    } catch {
      toast.error('Invalid backup file');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function clearAllData() {
  store.remove('tasks');
  store.remove('weatherHistory');
  store.remove('weatherApiKey');
  store.remove('quizHistory');
  store.remove('theme');
  toast.success('All data cleared. Refreshing...');
  setTimeout(() => location.reload(), 1500);
}

function statCard(icon, label, value, valueClass, subtext) {
  const icons = {
    'clipboard-list': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>',
    'check-circle': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    'clock': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    'brain': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>'
  };
  return `
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
      <div class="flex items-center gap-3 mb-3">
        <svg class="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">${icons[icon]}</svg>
        <span class="text-sm text-slate-500 dark:text-slate-400 font-medium">${label}</span>
      </div>
      <div class="text-3xl font-bold ${valueClass}">${value}</div>
      ${subtext ? `<p class="text-xs text-slate-400 dark:text-slate-500 mt-1">${subtext}</p>` : ''}
    </div>
  `;
}

export { renderDashboard };
