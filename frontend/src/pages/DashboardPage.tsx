import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Clock, GraduationCap, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { getHistory } from '../services/storage';
import type { PredictionHistoryItem } from '../types';

// ── Formatters ────────────────────────────────────────────────────────────────
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

// ── History Card ──────────────────────────────────────────────────────────────
const HistoryCard: React.FC<{ item: PredictionHistoryItem; isRecent: boolean }> = ({ item, isRecent }) => {
  const { form, result } = item;
  const safeCount   = result.colleges.filter(c => c.admission_chance === 'safe').length;
  const targetCount = result.colleges.filter(c => c.admission_chance === 'target').length;
  const dreamCount  = result.colleges.filter(c => c.admission_chance === 'dream').length;

  return (
    <div
      className={`card flex flex-col gap-4 border transition-shadow hover:shadow-md ${isRecent ? 'border-primary-container' : ''}`}
      style={{ borderColor: isRecent ? 'var(--color-primary-container)' : 'var(--color-outline-variant)' }}
    >
      {isRecent && (
        <div className="text-label-sm font-semibold" style={{ color: 'var(--color-primary-container)' }}>
          ★ Most Recent
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            {form.course} · Percentile {form.percentile}
          </div>
          <div className="text-body-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
            {form.category} · {form.cap_round} · {form.academic_year || 'Latest year'}
          </div>
          <div className="flex items-center gap-1 mt-2 text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            <Clock size={12} /> {fmtDate(item.timestamp)}
          </div>
        </div>

        <div className="flex gap-3 text-center">
          <div>
            <div className="text-headline-sm" style={{ color: 'var(--color-safe)' }}>{safeCount}</div>
            <div className="text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Safe</div>
          </div>
          <div>
            <div className="text-headline-sm" style={{ color: 'var(--color-target)' }}>{targetCount}</div>
            <div className="text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Target</div>
          </div>
          <div>
            <div className="text-headline-sm" style={{ color: 'var(--color-dream)' }}>{dreamCount}</div>
            <div className="text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Dream</div>
          </div>
          <div>
            <div className="text-headline-sm" style={{ color: 'var(--color-on-surface)' }}>{result.total}</div>
            <div className="text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Total</div>
          </div>
        </div>
      </div>

      {/* Top 3 colleges preview */}
      {result.colleges.slice(0, 3).length > 0 && (
        <div
          className="rounded-lg overflow-hidden border"
          style={{ borderColor: 'var(--color-outline-variant)' }}
        >
          {result.colleges.slice(0, 3).map((c, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-2.5 border-b last:border-0 text-body-sm"
              style={{ borderColor: 'var(--color-outline-variant)', backgroundColor: i % 2 === 0 ? 'var(--color-surface-container-low)' : 'var(--color-surface-card)' }}
            >
              <div className="flex flex-col min-w-0 mr-3">
                <span className="font-medium truncate" style={{ color: 'var(--color-on-surface)' }}>{c.college_name}</span>
                <span className="text-label-sm truncate" style={{ color: 'var(--color-on-surface-variant)' }}>{c.branch}</span>
              </div>
              <Badge chance={c.admission_chance} />
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <Link
          to="/results"
          className="flex items-center gap-1 text-label-md no-underline font-semibold"
          style={{ color: 'var(--color-primary-container)' }}
          onClick={() => {
            // Store this result as the "last result" for the Results page
            sessionStorage.setItem('pmc_last_result', JSON.stringify({ form: item.form, result: item.result }));
          }}
        >
          View Full Results <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
};

// ── Dashboard Page ────────────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const history = getHistory();
  const hasHistory = history.length > 0;

  return (
    <div className="py-10" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container-app max-w-4xl">

        {/* Welcome Banner */}
        <div
          className="rounded-2xl p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)' }}
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <GraduationCap size={24} color="white" />
              </div>
              <div>
                <h1 className="text-headline-md text-white">Welcome, Student! 👋</h1>
                <p className="text-body-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Track your college predictions here.
                </p>
              </div>
            </div>
            {hasHistory && (
              <p className="text-body-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
                You have <strong>{history.length}</strong> saved prediction{history.length > 1 ? 's' : ''}.
              </p>
            )}
          </div>

          <Link to="/predict">
            <button
              className="btn flex items-center gap-2 font-semibold px-6 py-3"
              style={{ backgroundColor: 'white', color: 'var(--color-primary-container)', borderRadius: '8px' }}
            >
              <Plus size={18} /> New Prediction
            </button>
          </Link>
        </div>

        {/* No History State */}
        {!hasHistory ? (
          <div className="card text-center py-20 flex flex-col items-center gap-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-surface-container)' }}
            >
              <GraduationCap size={36} style={{ color: 'var(--color-on-surface-variant)' }} />
            </div>
            <div>
              <h2 className="text-headline-sm mb-2" style={{ color: 'var(--color-on-surface)' }}>No predictions yet</h2>
              <p className="text-body-md max-w-sm mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>
                Start your first college prediction to see your results here.
              </p>
            </div>
            <Link to="/predict">
              <Button variant="primary" size="lg">Start First Prediction</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-headline-sm" style={{ color: 'var(--color-on-surface)' }}>Your Predictions</h2>
              <span className="text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{history.length} total</span>
            </div>

            {history.map((item, idx) => (
              <HistoryCard key={item.id} item={item} isRecent={idx === 0} />
            ))}

            <div className="flex justify-center pt-4">
              <Link to="/predict">
                <Button variant="outline" size="lg">
                  <Plus size={16} className="mr-2" /> Start New Prediction
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
