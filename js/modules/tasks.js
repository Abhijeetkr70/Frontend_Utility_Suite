import store from './store.js';
import toast from './toast.js';
import modal from './modal.js';

const TASKS_KEY = 'tasks';

let state = {
  tasks: [],
  filter: 'all',
  priorityFilter: null,
  searchQuery: '',
  sortBy: 'createdAt',
  selectedIds: new Set(),
  selectMode: false
};

function init() {
  state.tasks = store.get(TASKS_KEY, []);
}

function save() {
  store.set(TASKS_KEY, state.tasks);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getFilteredTasks() {
  let result = [...state.tasks];

  if (state.filter === 'pending') result = result.filter(t => !t.completed);
  else if (state.filter === 'completed') result = result.filter(t => t.completed);

  if (state.priorityFilter) result = result.filter(t => t.priority === state.priorityFilter);

  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    result = result.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  if (state.sortBy === 'dueDate') {
    result.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  } else if (state.sortBy === 'priority') {
    const order = { high: 0, medium: 1, low: 2 };
    result.sort((a, b) => order[a.priority] - order[b.priority]);
  } else {
    result.sort((a, b) => b.createdAt - a.createdAt);
  }

  return result;
}

function renderTasks() {
  const app = document.getElementById('app-content');
  const filtered = getFilteredTasks();

  const priorityChips = ['all', 'high', 'medium', 'low'].map(p =>
    `<button class="priority-chip px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${state.priorityFilter === p || (!state.priorityFilter && p === 'all') ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'}" data-priority="${p}">${p.charAt(0).toUpperCase() + p.slice(1)}</button>`
  ).join('');

  app.innerHTML = `
    <div class="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Task Manager</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-1">${state.tasks.length} total tasks · ${state.tasks.filter(t => t.completed).length} completed</p>
        </div>
        <div class="flex items-center gap-2">
          <button id="select-toggle-btn" class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${state.selectMode ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            ${state.selectMode ? 'Done' : 'Select'}
          </button>
          <button id="add-task-btn" class="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Add Task
          </button>
        </div>
      </div>

      ${state.selectedIds.size > 0 ? `
        <div class="flex items-center gap-3 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <span class="text-sm font-medium text-indigo-700 dark:text-indigo-300">${state.selectedIds.size} selected</span>
          <div class="flex-1"></div>
          <button id="batch-complete-btn" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors">
            ${state.selectedIds.size === state.tasks.filter(t => !t.completed).size ? 'Mark Pending' : 'Mark Complete'}
          </button>
          <button id="batch-delete-btn" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
            Delete
          </button>
          <button id="batch-clear-btn" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            Clear
          </button>
        </div>
      ` : ''}

      <div class="flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" id="task-search" placeholder="Search tasks..." value="${state.searchQuery}" class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
        </div>
        <select id="sort-select" class="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="createdAt" ${state.sortBy === 'createdAt' ? 'selected' : ''}>Newest First</option>
          <option value="dueDate" ${state.sortBy === 'dueDate' ? 'selected' : ''}>Due Date</option>
          <option value="priority" ${state.sortBy === 'priority' ? 'selected' : ''}>Priority</option>
        </select>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <span class="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">View:</span>
        ${['all', 'pending', 'completed'].map(f =>
          `<button class="filter-chip px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${state.filter === f ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'}" data-filter="${f}">${f.charAt(0).toUpperCase() + f.slice(1)}</button>`
        ).join('')}
        <span class="text-xs font-medium text-slate-500 dark:text-slate-400 ml-2 mr-1">Priority:</span>
        ${priorityChips}
      </div>

      <div id="tasks-list" class="space-y-3" data-list="tasks">
        ${filtered.length === 0 ? `
          <div class="text-center py-12">
            <svg class="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
            <p class="text-slate-400 dark:text-slate-500 font-medium">${state.searchQuery || state.priorityFilter || state.filter !== 'all' ? 'No tasks match your filters' : 'No tasks yet'}</p>
            <p class="text-sm text-slate-400 dark:text-slate-500 mt-1">${state.searchQuery || state.priorityFilter || state.filter !== 'all' ? 'Try adjusting your search or filters' : 'Click "Add Task" to create your first task'}</p>
          </div>
        ` : filtered.map(task => renderTaskCard(task)).join('')}
      </div>
    </div>
  `;

  attachTaskListeners();
}

function renderTaskCard(task) {
  const priorityColors = {
    high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    medium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    low: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
  };

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date(new Date().toDateString());

  const isSelected = state.selectedIds.has(task.id);

  return `
    <div class="task-card bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all ${task.completed ? 'opacity-75' : ''} ${isSelected ? 'ring-2 ring-indigo-500 border-indigo-500' : ''}" data-task-id="${task.id}">
      <div class="flex items-start gap-3">
        ${state.selectMode ? `
          <button class="select-task mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400'}" data-task-id="${task.id}">
            ${isSelected ? '<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>' : ''}
          </button>
        ` : `
          <button class="toggle-task mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400'}" data-task-id="${task.id}">
            ${task.completed ? '<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>' : ''}
          </button>
        `}
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-white ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}">${escapeHtml(task.title)}</h3>
            <span class="shrink-0 px-2 py-0.5 rounded-md text-xs font-medium ${priorityColors[task.priority]}">${task.priority}</span>
          </div>
          ${task.description ? `<p class="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">${escapeHtml(task.description)}</p>` : ''}
          <div class="flex flex-wrap items-center gap-2 mt-2">
            ${task.dueDate ? `
              <span class="inline-flex items-center gap-1 text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-slate-400 dark:text-slate-500'}">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                ${formatDate(task.dueDate)}${isOverdue ? ' (Overdue)' : ''}
              </span>
            ` : ''}
            ${task.tags && task.tags.length ? task.tags.map(tag =>
              `<span class="px-2 py-0.5 rounded-md text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">${escapeHtml(tag)}</span>`
            ).join('') : ''}
          </div>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <button class="edit-task p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" data-task-id="${task.id}" title="Edit">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </button>
          <button class="delete-task p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors" data-task-id="${task.id}" title="Delete">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function attachTaskListeners() {
  const container = document.getElementById('app-content');

  container.addEventListener('click', (e) => {
    const target = e.target.closest('button');
    if (!target) return;

    if (target.id === 'add-task-btn') showTaskForm();
    if (target.id === 'select-toggle-btn') {
      state.selectMode = !state.selectMode;
      if (!state.selectMode) state.selectedIds.clear();
      renderTasks();
      return;
    }
    if (target.id === 'batch-complete-btn') batchToggleComplete();
    if (target.id === 'batch-delete-btn') batchDelete();
    if (target.id === 'batch-clear-btn') { state.selectedIds.clear(); renderTasks(); return; }

    if (target.classList.contains('select-task')) {
      const id = target.dataset.taskId;
      if (state.selectedIds.has(id)) state.selectedIds.delete(id);
      else state.selectedIds.add(id);
      renderTasks();
      return;
    }

    const taskId = target.dataset.taskId;
    if (!taskId) return;

    if (target.classList.contains('toggle-task')) toggleTask(taskId);
    else if (target.classList.contains('edit-task')) showTaskForm(taskId);
    else if (target.classList.contains('delete-task')) deleteTask(taskId);
  });

  container.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (chip) {
      state.filter = chip.dataset.filter;
      state.selectedIds.clear();
      renderTasks();
    }
    const pChip = e.target.closest('.priority-chip');
    if (pChip) {
      const p = pChip.dataset.priority;
      state.priorityFilter = p === 'all' ? null : p;
      renderTasks();
    }
  });

  const searchInput = document.getElementById('task-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderTasks();
    });
  }

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderTasks();
    });
  }
}

function batchToggleComplete() {
  const allCompleted = [...state.selectedIds].every(id => {
    const t = state.tasks.find(t => t.id === id);
    return t && t.completed;
  });
  state.tasks.forEach(t => {
    if (state.selectedIds.has(t.id)) t.completed = !allCompleted;
  });
  save();
  toast.success(allCompleted ? 'Tasks marked pending' : 'Tasks completed');
  state.selectedIds.clear();
  renderTasks();
}

function batchDelete() {
  const count = state.selectedIds.size;
  modal.open(`
    <p class="text-slate-600 dark:text-slate-300">Delete <strong>${count}</strong> task${count > 1 ? 's' : ''}? This action cannot be undone.</p>
    <div class="flex gap-3 mt-6">
      <button id="confirm-batch-delete" class="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors">Delete</button>
      <button id="cancel-batch-delete" class="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors">Cancel</button>
    </div>
  `, { title: 'Delete Tasks' });
  document.getElementById('confirm-batch-delete')?.addEventListener('click', () => {
    state.tasks = state.tasks.filter(t => !state.selectedIds.has(t.id));
    state.selectedIds.clear();
    save();
    modal.close();
    toast.success(`${count} task${count > 1 ? 's' : ''} deleted`);
    renderTasks();
  });
  document.getElementById('cancel-batch-delete')?.addEventListener('click', () => modal.close());
}

function toggleTask(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  save();
  toast[task.completed ? 'success' : 'info'](task.completed ? 'Task completed!' : 'Task reopened');
  renderTasks();
}

function deleteTask(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;
  modal.open(`
    <p class="text-slate-600 dark:text-slate-300">Are you sure you want to delete <strong>${escapeHtml(task.title)}</strong>? This action cannot be undone.</p>
    <div class="flex gap-3 mt-6">
      <button id="confirm-delete" class="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors" data-task-id="${id}">Delete</button>
      <button id="cancel-delete" class="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors">Cancel</button>
    </div>
  `, { title: 'Delete Task' });

  document.getElementById('confirm-delete')?.addEventListener('click', () => {
    state.tasks = state.tasks.filter(t => t.id !== id);
    save();
    modal.close();
    toast.success('Task deleted');
    renderTasks();
  });
  document.getElementById('cancel-delete')?.addEventListener('click', () => modal.close());
}

function showTaskForm(taskId = null) {
  const task = taskId ? state.tasks.find(t => t.id === taskId) : null;
  const isEdit = !!task;

  const formHtml = `
    <form id="task-form" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Title *</label>
        <input type="text" id="task-title" required value="${task ? escapeHtml(task.title) : ''}" placeholder="Enter task title" class="w-full px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
        <textarea id="task-desc" rows="3" placeholder="Enter description (optional)" class="w-full px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none">${task ? escapeHtml(task.description) : ''}</textarea>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Due Date</label>
          <input type="date" id="task-date" value="${task && task.dueDate ? task.dueDate : ''}" class="w-full px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Priority</label>
          <select id="task-priority" class="w-full px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="low" ${task && task.priority === 'low' ? 'selected' : ''}>Low</option>
            <option value="medium" ${(!task || task.priority === 'medium') ? 'selected' : ''}>Medium</option>
            <option value="high" ${task && task.priority === 'high' ? 'selected' : ''}>High</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tags (comma separated)</label>
        <input type="text" id="task-tags" value="${task && task.tags ? task.tags.join(', ') : ''}" placeholder="e.g. work, personal, urgent" class="w-full px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
      </div>
      <button type="submit" class="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
        ${isEdit ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  `;

  modal.open(formHtml, {
    title: isEdit ? 'Edit Task' : 'New Task',
    width: 'max-w-md'
  });

  document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value.trim();
    if (!title) return toast.error('Title is required');

    const formData = {
      title,
      description: document.getElementById('task-desc').value.trim(),
      dueDate: document.getElementById('task-date').value || null,
      priority: document.getElementById('task-priority').value,
      tags: document.getElementById('task-tags').value.split(',').map(t => t.trim()).filter(Boolean)
    };

    if (isEdit) {
      Object.assign(task, formData);
      save();
      toast.success('Task updated');
    } else {
      const newTask = {
        id: generateId(),
        ...formData,
        completed: false,
        createdAt: Date.now()
      };
      state.tasks.unshift(newTask);
      save();
      toast.success('Task created');
    }

    modal.close();
    renderTasks();
  });
}

function renderTaskManager() {
  init();
  renderTasks();
}

export { renderTaskManager };
