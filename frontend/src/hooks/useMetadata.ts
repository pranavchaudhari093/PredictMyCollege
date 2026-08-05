import { useState, useEffect } from 'react';
import { fetchMetadata } from '../services/api';
import type { Metadata } from '../types';

let cachedMetadata: Metadata | null = null;

export const useMetadata = (course?: string) => {
  const [metadata, setMetadata] = useState<Metadata | null>(cachedMetadata);
  const [loading, setLoading]   = useState(!cachedMetadata);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchMetadata(course)
      .then(data => {
        if (!course) cachedMetadata = data;
        setMetadata(data);
      })
      .catch(() => setError('Failed to load form options. Is the backend running?'))
      .finally(() => setLoading(false));
  }, [course]);

  return { metadata, loading, error };
};

