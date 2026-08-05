import { useState } from 'react';
import { predictColleges } from '../services/api';
import { savePrediction } from '../services/storage';
import type { PredictionForm, PredictionResult } from '../types';

export const usePrediction = () => {
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [result, setResult]     = useState<PredictionResult | null>(null);

  const predict = async (form: PredictionForm): Promise<PredictionResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await predictColleges(form);
      setResult(data);
      savePrediction(form, data);
      return data;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })
        ?.response?.data?.error ?? 'Prediction failed. Please try again.';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { predict, loading, error, result };
};
