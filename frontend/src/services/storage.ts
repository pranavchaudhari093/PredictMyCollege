import type { PredictionHistoryItem, PredictionForm, PredictionResult } from '../types';

const HISTORY_KEY = 'pmc_prediction_history';
const LAST_RESULT_KEY = 'pmc_last_result';
const MAX_HISTORY = 10;

export const savePrediction = (form: PredictionForm, result: PredictionResult): string => {
  const id = Date.now().toString(36);
  const item: PredictionHistoryItem = {
    id,
    timestamp: new Date().toISOString(),
    form,
    result,
  };

  const existing = getHistory();
  const updated = [item, ...existing].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));

  // Also cache last result in sessionStorage for the results page
  sessionStorage.setItem(LAST_RESULT_KEY, JSON.stringify({ form, result }));

  return id;
};

export const getHistory = (): PredictionHistoryItem[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const getLastResult = (): { form: PredictionForm; result: PredictionResult } | null => {
  try {
    const raw = sessionStorage.getItem(LAST_RESULT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};
