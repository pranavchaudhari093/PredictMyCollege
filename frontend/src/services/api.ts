import axios from 'axios';
import type { PredictionForm, PredictionResult, Metadata } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

export const fetchMetadata = (course = '', percentile = ''): Promise<Metadata> => {
  const params = new URLSearchParams();
  if (course) params.append('course', course);
  if (percentile) params.append('percentile', percentile);
  return api.get<Metadata>(`/metadata${params.toString() ? '?' + params.toString() : ''}`).then(r => r.data);
};


export const predictColleges = (form: PredictionForm): Promise<PredictionResult> =>
  api.post<PredictionResult>('/predict', form).then(r => r.data);

export const checkHealth = () =>
  api.get('/health').then(r => r.data);

export default api;
