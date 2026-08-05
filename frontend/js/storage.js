/**
 * PredictMyCollege — Local & Session Storage Manager
 */
const HISTORY_KEY = 'pmc_prediction_history';
const LAST_RESULT_KEY = 'pmc_last_result';
const PROFILE_KEY = 'pmc_user_profile';
const MAX_HISTORY = 20;

export function savePrediction(form, result) {
  const id = Date.now().toString(36);
  const item = {
    id,
    timestamp: new Date().toISOString(),
    form,
    result,
  };

  const existing = getHistory();
  const updated = [item, ...existing].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  sessionStorage.setItem(LAST_RESULT_KEY, JSON.stringify({ form, result }));

  return id;
}

export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function deleteHistoryItem(id) {
  try {
    const existing = getHistory();
    const updated = existing.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearAllHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
    sessionStorage.removeItem(LAST_RESULT_KEY);
    return [];
  } catch {
    return [];
  }
}

export function getLastResult() {
  try {
    const raw = sessionStorage.getItem(LAST_RESULT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setLastResult(form, result) {
  sessionStorage.setItem(LAST_RESULT_KEY, JSON.stringify({ form, result }));
}

export function getUserProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : {
      fullName: '',
      email: '',
      phone: '',
      category: 'OPEN',
      homeUniversity: 'SPPU',
      percentile: '',
      avatarUrl: '',
    };
  } catch {
    return {
      fullName: '',
      email: '',
      phone: '',
      category: 'OPEN',
      homeUniversity: 'SPPU',
      percentile: '',
      avatarUrl: '',
    };
  }
}

export function saveUserProfile(profileData) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
    return true;
  } catch {
    return false;
  }
}
