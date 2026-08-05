import { getHistory, deleteHistoryItem, clearAllHistory, setLastResult, getUserProfile, saveUserProfile } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  const fullNameInput = document.getElementById('fullNameInput');
  const emailInput = document.getElementById('emailInput');
  const phoneInput = document.getElementById('phoneInput');
  const categorySelect = document.getElementById('categorySelect');
  const universitySelect = document.getElementById('universitySelect');
  const percentileInput = document.getElementById('percentileInput');
  const avatarFileInput = document.getElementById('avatarFileInput');
  const sidebarUserName = document.getElementById('sidebarUserName');
  const saveChangesBtn = document.getElementById('saveChangesBtn');
  const saveToast = document.getElementById('saveToast');
  const clearAllHistoryBtn = document.getElementById('clearAllHistoryBtn');

  // Load User Profile from storage
  const profile = getUserProfile();
  if (fullNameInput) fullNameInput.value = profile.fullName || '';
  if (emailInput) emailInput.value = profile.email || '';
  if (phoneInput) phoneInput.value = profile.phone || '';
  if (categorySelect) categorySelect.value = profile.category || 'OPEN';
  if (universitySelect) universitySelect.value = profile.homeUniversity || 'SPPU';
  if (percentileInput) percentileInput.value = profile.percentile || '';
  if (sidebarUserName) sidebarUserName.textContent = profile.fullName || 'New Aspirant';

  updateAvatarDisplay(profile.avatarUrl);

  // Handle Photo Upload
  avatarFileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        if (dataUrl) {
          profile.avatarUrl = dataUrl;
          updateAvatarDisplay(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  });

  // Save Profile Changes
  saveChangesBtn?.addEventListener('click', () => {
    const updated = {
      fullName: fullNameInput.value.trim() || 'New Aspirant',
      email: emailInput.value.trim() || 'student@example.com',
      phone: phoneInput.value.trim() || '',
      category: categorySelect.value,
      homeUniversity: universitySelect.value,
      percentile: percentileInput.value.trim() || '0',
      avatarUrl: profile.avatarUrl || '',
    };

    saveUserProfile(updated);
    if (sidebarUserName) sidebarUserName.textContent = updated.fullName;

    if (saveToast) {
      saveToast.classList.remove('hidden');
      saveToast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => {
        saveToast.classList.add('hidden');
      }, 3500);
    }
  });

  // Render Recent Predictions
  renderRecentPredictions();

  // Clear All History Button
  clearAllHistoryBtn?.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all prediction history?')) {
      clearAllHistory();
      renderRecentPredictions();
    }
  });
});

function updateAvatarDisplay(avatarUrl) {
  const profileContainer = document.getElementById('profileAvatarContainer');
  const sidebarContainer = document.getElementById('sidebarAvatarContainer');

  const mainHtml = avatarUrl
    ? `<img src="${avatarUrl}" alt="User Avatar" class="w-full h-full object-cover" />`
    : `<span class="material-symbols-outlined text-3xl sm:text-4xl text-primary">person</span>`;

  const sidebarHtml = avatarUrl
    ? `<img src="${avatarUrl}" alt="User Avatar" class="w-full h-full object-cover" />`
    : `<span class="material-symbols-outlined text-xl text-primary">person</span>`;

  if (profileContainer) profileContainer.innerHTML = mainHtml;
  if (sidebarContainer) sidebarContainer.innerHTML = sidebarHtml;
}

function renderRecentPredictions() {
  const container = document.getElementById('recentPredictionsList');
  if (!container) return;

  const history = getHistory();
  if (history.length === 0) {
    container.innerHTML = `
      <div class="p-md bg-surface-container-low border border-outline-variant rounded-xl text-center text-secondary text-xs">
        No recent predictions saved. Start a new prediction to see history here.
      </div>
    `;
    return;
  }

  container.innerHTML = history.map((item, idx) => {
    const { form, result, timestamp } = item;
    const safeCount = (result.colleges || []).filter(c => c.admission_chance === 'safe').length;
    const targetCount = (result.colleges || []).filter(c => c.admission_chance === 'target').length;
    const dreamCount = (result.colleges || []).filter(c => c.admission_chance === 'dream').length;
    const dateStr = new Date(timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    return `
      <div class="bg-surface-container-low border border-outline-variant/80 rounded-xl p-3 sm:p-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5">
        <div class="space-y-1 min-w-0 flex-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            ${idx === 0 ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">Latest</span>` : ''}
            <span class="font-bold text-on-surface text-xs sm:text-sm">${form.course || 'B.E/B.Tech'} · ${form.percentile}%ile</span>
          </div>
          <p class="text-[11px] text-secondary">
            Category: <strong>${form.category}</strong> | Round: ${form.cap_round} | ${dateStr}
          </p>
          <div class="flex items-center gap-2 text-[11px] pt-0.5">
            <span class="text-emerald-700 font-bold">${safeCount} Safe</span>
            <span class="text-blue-700 font-bold">${targetCount} Target</span>
            <span class="text-gray-700 font-bold">${dreamCount} Dream</span>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end pt-1 sm:pt-0">
          <button data-id="${item.id}" class="view-res-btn flex-1 sm:flex-initial px-3 py-2 bg-primary-container text-white rounded-lg text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1 h-9">
            <span>View Results</span>
            <span class="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
          <button data-id="${item.id}" class="delete-res-btn p-2 bg-white border border-outline-variant text-error hover:bg-error-container rounded-lg transition-colors flex items-center justify-center h-9 w-9" title="Delete this prediction">
            <span class="material-symbols-outlined text-base">delete</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Add click listeners to View Results
  container.querySelectorAll('.view-res-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const found = history.find(h => h.id === id);
      if (found) {
        setLastResult(found.form, found.result);
        window.location.href = '/results.html';
      }
    });
  });

  // Add click listeners to Delete Buttons
  container.querySelectorAll('.delete-res-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (id && confirm('Are you sure you want to delete this prediction?')) {
        deleteHistoryItem(id);
        renderRecentPredictions();
      }
    });
  });
}
