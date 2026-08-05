import { useState, useMemo } from 'react';
import type { College, ActiveFilters } from '../types';

const ITEMS_PER_PAGE = 20;

const DEFAULT_FILTERS: ActiveFilters = {
  search: '',
  districts: [],
  college_types: [],
  branches: [],
  admission_chances: [],
  sort: 'chance',
};

export const useFilters = (colleges: College[]) => {
  const [filters, setFilters] = useState<ActiveFilters>(DEFAULT_FILTERS);
  const [page, setPage]       = useState(1);

  const filtered = useMemo(() => {
    let list = [...colleges];

    // Search
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(c =>
        c.college_name.toLowerCase().includes(q) ||
        c.branch.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        String(c.institute_code).includes(q)
      );
    }

    // District (location)
    if (filters.districts.length > 0) {
      list = list.filter(c =>
        filters.districts.some(d => c.location.toLowerCase().includes(d.toLowerCase()))
      );
    }

    // College type
    if (filters.college_types.length > 0) {
      list = list.filter(c => filters.college_types.includes(c.status_type));
    }

    // Branch
    if (filters.branches.length > 0) {
      list = list.filter(c =>
        filters.branches.some(b => c.branch.toLowerCase().includes(b.toLowerCase()))
      );
    }

    // Admission chance
    if (filters.admission_chances.length > 0) {
      list = list.filter(c => filters.admission_chances.includes(c.admission_chance));
    }

    // Sort
    const chanceOrder = { safe: 0, target: 1, dream: 2, unknown: 3 };
    if (filters.sort === 'chance') {
      list.sort((a, b) => chanceOrder[a.admission_chance] - chanceOrder[b.admission_chance]);
    } else if (filters.sort === 'cutoff_desc') {
      list.sort((a, b) => (b.cutoff_percentile ?? 0) - (a.cutoff_percentile ?? 0));
    } else if (filters.sort === 'cutoff_asc') {
      list.sort((a, b) => (a.cutoff_percentile ?? 0) - (b.cutoff_percentile ?? 0));
    } else if (filters.sort === 'name') {
      list.sort((a, b) => a.college_name.localeCompare(b.college_name));
    }

    return list;
  }, [colleges, filters]);

  const totalPages  = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated   = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const updateFilter = <K extends keyof ActiveFilters>(key: K, value: ActiveFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const toggleArrayFilter = <K extends keyof Pick<ActiveFilters, 'districts' | 'college_types' | 'branches' | 'admission_chances'>>(
    key: K,
    value: string
  ) => {
    setFilters(prev => {
      const arr = prev[key] as string[];
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
    setPage(1);
  };

  return {
    filters,
    filtered,
    paginated,
    page,
    totalPages,
    totalFiltered: filtered.length,
    setPage,
    updateFilter,
    clearFilters,
    toggleArrayFilter,
    ITEMS_PER_PAGE,
  };
};
