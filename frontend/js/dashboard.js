import { getHistory, setLastResult, deleteHistoryItem } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
});

function renderDashboard() {
  const history = getHistory();
  const container = document.getElementById('historyContainer');
  const historyCount = document.getElementById('historyCount');

  const kpiSavedCount = document.getElementById('kpiSavedCount');
  const kpiLatestScore = document.getElementById('kpiLatestScore');
  const kpiSafeCount = document.getElementById('kpiSafeCount');
  const kpiCategory = document.getElementById('kpiCategory');

  if (kpiSavedCount) kpiSavedCount.textContent = history.length;
  if (historyCount) historyCount.textContent = `${history.length} prediction${history.length !== 1 ? 's' : ''} saved`;

  if (history.length > 0) {
    const latest = history[0];
    if (kpiLatestScore) kpiLatestScore.textContent = `${latest.form.percentile}%`;
    if (kpiCategory) kpiCategory.textContent = latest.form.category || 'OPEN';

    const totalSafe = (latest.result.colleges || []).filter(c => c.admission_chance === 'safe').length;
    if (kpiSafeCount) kpiSafeCount.textContent = totalSafe;
  } else {
    if (kpiLatestScore) kpiLatestScore.textContent = '—';
    if (kpiCategory) kpiCategory.textContent = '—';
    if (kpiSafeCount) kpiSafeCount.textContent = '0';
  }

  if (history.length === 0) {
    container.innerHTML = `
      <div class="bg-white border border-outline-variant rounded-2xl p-6 md:p-10 text-center space-y-3 shadow-sm">
        <div class="w-14 h-14 bg-primary-container/10 text-primary rounded-full flex items-center justify-center mx-auto">
          <span class="material-symbols-outlined text-3xl">school</span>
        </div>
        <h3 class="text-base md:text-xl font-bold text-on-surface">No Saved Predictions Yet</h3>
        <p class="text-xs md:text-sm text-secondary max-w-xs mx-auto">You haven't run any college predictions yet. Start your first prediction to see recommendations here.</p>
        <a href="/predict.html" class="inline-flex items-center gap-xs bg-primary-container text-white px-lg py-2.5 rounded-xl font-bold text-xs hover:opacity-90 transition-all shadow-sm">
          <span>Start Your First Prediction</span>
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = history.map((item, index) => {
    const { form, result, timestamp } = item;
    const safeCount = (result.colleges || []).filter(c => c.admission_chance === 'safe').length;
    const targetCount = (result.colleges || []).filter(c => c.admission_chance === 'target').length;
    const dreamCount = (result.colleges || []).filter(c => c.admission_chance === 'dream').length;
    const dateStr = new Date(timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    return `
      <div class="bg-white border border-outline-variant rounded-xl p-3.5 sm:p-md md:p-lg space-y-3 shadow-sm hover:shadow-md transition-shadow">
        <!-- Top Row: Tags & Info -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-outline-variant/60 pb-2.5">
          <div class="space-y-0.5">
            <div class="flex items-center gap-1.5 flex-wrap">
              ${index === 0 ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">Latest</span>` : ''}
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container-low border border-outline-variant text-secondary">${form.course || 'B.E/B.Tech'}</span>
              <span class="text-xs font-bold text-primary">${form.percentile}%ile</span>
            </div>
            <p class="text-[11px] sm:text-xs text-secondary">
              Category: <strong class="text-on-surface">${form.category}</strong> | Round: <strong class="text-on-surface">${form.cap_round}</strong> | ${dateStr}
            </p>
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto pt-1 sm:pt-0">
            <button data-history-id="${item.id}" class="view-result-btn flex-1 sm:flex-initial bg-primary-container text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1 shadow-sm h-10">
              <span>View Results</span>
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            <button data-delete-id="${item.id}" class="delete-history-btn text-secondary hover:text-error p-2 rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center" title="Delete Prediction">
              <span class="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>
        </div>

        <!-- Breakdown Stats Bar -->
        <div class="grid grid-cols-4 gap-1.5 sm:gap-md text-center bg-surface-container-low p-2 sm:p-md rounded-lg">
          <div class="bg-emerald-50 border border-emerald-200 p-1.5 rounded-md">
            <div class="text-xs sm:text-base font-bold text-emerald-700">${safeCount}</div>
            <div class="text-[9px] sm:text-xs text-emerald-800 font-bold">Safe</div>
          </div>
          <div class="bg-blue-50 border border-blue-200 p-1.5 rounded-md">
            <div class="text-xs sm:text-base font-bold text-blue-700">${targetCount}</div>
            <div class="text-[9px] sm:text-xs text-blue-800 font-bold">Target</div>
          </div>
          <div class="bg-gray-100 border border-gray-200 p-1.5 rounded-md">
            <div class="text-xs sm:text-base font-bold text-gray-700">${dreamCount}</div>
            <div class="text-[9px] sm:text-xs text-gray-800 font-bold">Dream</div>
          </div>
          <div class="bg-white border border-outline-variant/60 p-1.5 rounded-md">
            <div class="text-xs sm:text-base font-bold text-on-surface">${result.total || 0}</div>
            <div class="text-[9px] sm:text-xs text-secondary font-bold">Total</div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Add click listeners to View Result buttons
  document.querySelectorAll('.view-result-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-history-id');
      const found = history.find(h => h.id === id);
      if (found) {
        setLastResult(found.form, found.result);
        window.location.href = '/results.html';
      }
    });
  });

  // Add click listeners to Delete buttons
  document.querySelectorAll('.delete-history-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-delete-id');
      if (id && confirm('Are you sure you want to delete this saved prediction?')) {
        deleteHistoryItem(id);
        renderDashboard();
      }
    });
  });
}
