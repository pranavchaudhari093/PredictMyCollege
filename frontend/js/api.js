/**
 * PredictMyCollege — API Service Layer
 */
const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || '/api';

export async function fetchMetadata(course = '', percentile = '') {
  const params = new URLSearchParams();
  if (course) params.append('course', course);
  if (percentile) params.append('percentile', percentile);

  const url = `${API_BASE}/metadata${params.toString() ? '?' + params.toString() : ''}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch metadata from server.');
  }
  return await response.json();
}

export async function predictColleges(formData) {
  const response = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Prediction request failed.');
  }
  return await response.json();
}
