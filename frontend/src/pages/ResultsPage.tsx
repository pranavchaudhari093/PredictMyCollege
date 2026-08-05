import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X, ArrowUpDown } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useFilters } from '../hooks/useFilters';
import { getLastResult } from '../services/storage';
import type { College, FiltersMeta } from '../types';

// ── Formatters ────────────────────────────────────────────────────────────────
const fmtPct = (v: number | null) => (v == null ? '—' : v.toFixed(2));

// ── Filter Sidebar ────────────────────────────────────────────────────────────
const FilterSidebar: React.FC<{
  filtersMeta: FiltersMeta;
  filters: ReturnType<typeof useFilters>['filters'];
  toggleArrayFilter: ReturnType<typeof useFilters>['toggleArrayFilter'];
  clearFilters: () => void;
}> = ({ filtersMeta, filters, toggleArrayFilter, clearFilters }) => {
  const hasActive = filters.districts.length > 0 || filters.college_types.length > 0 ||
    filters.branches.length > 0 || filters.admission_chances.length > 0;

  const CheckGroup = <K extends 'districts' | 'college_types' | 'branches'>({
    title, key, items,
  }: { title: string; key: K; items: string[] }) => (
    <div className="border-b pb-4" style={{ borderColor: 'var(--color-outline-variant)' }}>
      <h4 className="text-label-md mb-3" style={{ color: 'var(--color-on-surface)' }}>{title}</h4>
      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
        {items.slice(0, 30).map(item => (
          <label key={item} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={(filters[key] as string[]).includes(item)}
              onChange={() => toggleArrayFilter(key, item)}
              className="w-4 h-4 rounded"
              style={{ accentColor: 'var(--color-primary-container)' }}
            />
            <span className="text-body-sm truncate" style={{ color: 'var(--color-on-surface)' }}>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <aside
      className="w-full lg:w-60 flex-shrink-0 card flex flex-col gap-4 h-fit sticky top-20"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-headline-sm flex items-center gap-2" style={{ color: 'var(--color-on-surface)' }}>
          <SlidersHorizontal size={16} /> Filters
        </h3>
        {hasActive && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-label-sm"
            style={{ color: 'var(--color-primary-container)' }}
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* Admission Chance */}
      <div className="border-b pb-4" style={{ borderColor: 'var(--color-outline-variant)' }}>
        <h4 className="text-label-md mb-3" style={{ color: 'var(--color-on-surface)' }}>Admission Chance</h4>
        <div className="flex flex-col gap-2">
          {(['safe', 'target', 'dream'] as const).map(c => (
            <label key={c} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.admission_chances.includes(c)}
                onChange={() => toggleArrayFilter('admission_chances', c)}
                className="w-4 h-4"
                style={{ accentColor: 'var(--color-primary-container)' }}
              />
              <Badge chance={c} />
            </label>
          ))}
        </div>
      </div>

      <CheckGroup title="District / Location" key="districts" items={filtersMeta.districts} />
      <CheckGroup title="College Type"        key="college_types" items={filtersMeta.college_types} />
      <CheckGroup title="Branch"              key="branches" items={filtersMeta.branches} />
    </aside>
  );
};

// ── College Row ───────────────────────────────────────────────────────────────
const CollegeRow: React.FC<{ college: College; index: number }> = ({ college, index }) => (
  <tr
    className="border-b transition-colors"
    style={{ borderColor: 'var(--color-outline-variant)' }}
    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-container-low)')}
    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
  >
    <td className="py-3 px-4 text-label-sm" style={{ color: 'var(--color-on-surface-variant)', minWidth: '44px' }}>
      {String(college.institute_code)}
    </td>
    <td className="py-3 px-4" style={{ minWidth: '200px' }}>
      <div className="text-body-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>{college.college_name}</div>
      <div className="text-label-sm mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>{college.location}</div>
    </td>
    <td className="py-3 px-4 text-body-sm" style={{ color: 'var(--color-on-surface)', minWidth: '160px' }}>
      {college.branch}
    </td>
    <td className="py-3 px-4 text-label-sm text-center" style={{ color: 'var(--color-on-surface-variant)', minWidth: '80px' }}>
      {fmtPct(college.cap_round_1_cutoff)}
    </td>
    <td className="py-3 px-4 text-label-sm text-center" style={{ color: 'var(--color-on-surface-variant)', minWidth: '80px' }}>
      {fmtPct(college.cap_round_2_cutoff)}
    </td>
    <td className="py-3 px-4 text-label-sm text-center" style={{ color: 'var(--color-on-surface-variant)', minWidth: '80px' }}>
      {fmtPct(college.cap_round_3_cutoff)}
    </td>
    <td className="py-3 px-4 text-label-sm text-center" style={{ color: 'var(--color-on-surface-variant)', minWidth: '80px' }}>
      {fmtPct(college.cap_round_4_cutoff ?? null)}
    </td>
    <td className="py-3 px-4 text-center" style={{ minWidth: '100px' }}>
      <Badge chance={college.admission_chance} />
    </td>

  </tr>
);

// ── Pagination ────────────────────────────────────────────────────────────────
const Pagination: React.FC<{ page: number; totalPages: number; setPage: (p: number) => void }> = ({
  page, totalPages, setPage
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (page <= 4) return i + 1 <= 5 ? i + 1 : i + 1 === 6 ? -1 : totalPages;
    if (page >= totalPages - 3) return i < 2 ? i + 1 : i === 2 ? -1 : totalPages - (6 - i);
    return [1, -1, page - 1, page, page + 1, -1, totalPages][i];
  });

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg disabled:opacity-40 transition-colors"
        style={{ color: 'var(--color-on-surface)' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-container)')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((p, i) =>
        p === -1 ? (
          <span key={`ellipsis-${i}`} className="px-2 text-label-md" style={{ color: 'var(--color-on-surface-variant)' }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => setPage(p)}
            className="w-9 h-9 rounded-lg text-label-md transition-colors"
            style={{
              backgroundColor: p === page ? 'var(--color-primary-container)' : 'transparent',
              color: p === page ? 'white' : 'var(--color-on-surface)',
            }}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg disabled:opacity-40 transition-colors"
        style={{ color: 'var(--color-on-surface)' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-container)')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

// ── Results Page ──────────────────────────────────────────────────────────────
const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const saved = getLastResult();

  useEffect(() => {
    if (!saved) navigate('/predict');
  }, [saved, navigate]);

  const colleges: College[] = saved?.result?.colleges ?? [];
  const filtersMeta = saved?.result?.filters_meta ?? { districts: [], college_types: [], branches: [] };

  const {
    filters, paginated, page, totalPages, totalFiltered,
    setPage, updateFilter, clearFilters, toggleArrayFilter,
  } = useFilters(colleges);

  if (!saved) return null;

  const { form, result } = saved;

  return (
    <div className="py-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container-app">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-label-sm mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
          <Link to="/predict" className="hover:underline no-underline" style={{ color: 'var(--color-primary-container)' }}>← Back to Prediction</Link>
          <span>/</span>
          <span>Results</span>
        </div>

        {/* Summary bar */}
        <div className="card mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-headline-md" style={{ color: 'var(--color-on-surface)' }}>Prediction Results</h1>
              <p className="text-body-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                {form.course} · {form.category} · Percentile: <strong>{form.percentile}</strong> · {form.cap_round}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-headline-md" style={{ color: 'var(--color-primary-container)' }}>{result.total}</div>
                <div className="text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Total Found</div>
              </div>
              <div className="text-center">
                <div className="text-headline-md" style={{ color: 'var(--color-safe)' }}>
                  {colleges.filter(c => c.admission_chance === 'safe').length}
                </div>
                <div className="text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Safe</div>
              </div>
              <div className="text-center">
                <div className="text-headline-md" style={{ color: 'var(--color-target)' }}>
                  {colleges.filter(c => c.admission_chance === 'target').length}
                </div>
                <div className="text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Target</div>
              </div>
              <div className="text-center">
                <div className="text-headline-md" style={{ color: 'var(--color-dream)' }}>
                  {colleges.filter(c => c.admission_chance === 'dream').length}
                </div>
                <div className="text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Dream</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Filter Sidebar ── */}
          <FilterSidebar
            filtersMeta={filtersMeta}
            filters={filters}
            toggleArrayFilter={toggleArrayFilter}
            clearFilters={clearFilters}
          />

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            {/* Search + Sort bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-on-surface-variant)' }} />
                <input
                  type="text"
                  placeholder="Search colleges, branches, locations…"
                  value={filters.search}
                  onChange={e => updateFilter('search', e.target.value)}
                  className="input-field pl-9"
                />
              </div>
              <div className="relative">
                <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-on-surface-variant)' }} />
                <select
                  value={filters.sort}
                  onChange={e => updateFilter('sort', e.target.value as typeof filters.sort)}
                  className="input-field pl-9 pr-8 appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23737686' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center' }}
                >
                  <option value="chance">Sort: Admission Chance</option>
                  <option value="cutoff_desc">Sort: Cutoff (High → Low)</option>
                  <option value="cutoff_asc">Sort: Cutoff (Low → High)</option>
                  <option value="name">Sort: College Name</option>
                </select>
              </div>
            </div>

            <div className="text-label-sm mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>
              Showing {paginated.length} of {totalFiltered} colleges
              {totalFiltered < result.total && ` (filtered from ${result.total})`}
            </div>

            {/* Table */}
            {paginated.length === 0 ? (
              <div className="card text-center py-16">
                <p className="text-headline-sm" style={{ color: 'var(--color-on-surface-variant)' }}>No colleges match your filters.</p>
                <button
                  className="btn btn-outline mt-4"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="card p-0 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                      {['Code', 'College / Location', 'Branch', 'R1 Cutoff', 'R2 Cutoff', 'R3 Cutoff', 'R4 Cutoff', 'Chance'].map(h => (

                        <th
                          key={h}
                          className="text-left py-3 px-4 text-label-sm font-semibold uppercase tracking-wide"
                          style={{ color: 'var(--color-on-surface-variant)', letterSpacing: '0.05em' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((college, i) => (
                      <CollegeRow key={`${college.institute_code}-${college.branch}-${i}`} college={college} index={i} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <Pagination page={page} totalPages={totalPages} setPage={setPage} />

            {/* Actions */}
            <div className="flex gap-3 mt-6 justify-end">
              <Link to="/predict">
                <Button variant="outline">New Prediction</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="primary">Go to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
