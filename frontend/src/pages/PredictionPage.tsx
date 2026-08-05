import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Info } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { useMetadata } from '../hooks/useMetadata';
import { usePrediction } from '../hooks/usePrediction';
import type { PredictionForm } from '../types';

const EMPTY_FORM: PredictionForm = {
  course: '',
  academic_year: '',
  percentile: '',
  category: '',
  gender: '',
  home_university: '',
  district: '',
  preferred_branch: '',
  cap_round: '',
};

// ── Field Error Validation ────────────────────────────────────────────────────
const validate = (form: PredictionForm): Partial<Record<keyof PredictionForm, string>> => {
  const errors: Partial<Record<keyof PredictionForm, string>> = {};
  if (!form.course)       errors.course       = 'Please select a course.';
  if (!form.percentile || Number(form.percentile) < 0 || Number(form.percentile) > 100)
    errors.percentile = 'Enter a valid percentile (0–100).';
  if (!form.category)     errors.category     = 'Please select your category.';
  return errors;
};

// ── Info Tip ──────────────────────────────────────────────────────────────────
const Tip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="flex items-start gap-2 p-3 rounded-lg text-body-sm"
    style={{ backgroundColor: 'var(--color-primary-fixed)', color: 'var(--color-on-surface)' }}
  >
    <Info size={15} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--color-primary-container)' }} />
    {children}
  </div>
);

// ── Prediction Page ───────────────────────────────────────────────────────────
const PredictionPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm]     = useState<PredictionForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof PredictionForm, string>>>({});
  const { metadata, loading: metaLoading, error: metaError } = useMetadata(form.course);
  const { predict, loading: predicting, error: predError } = usePrediction();

  const set = (key: keyof PredictionForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.value;
    setForm(prev => {
      const next = { ...prev, [key]: val };
      if (key === 'course') {
        next.preferred_branch = '';
      }
      return next;
    });
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const result = await predict({ ...form, percentile: Number(form.percentile) });
    if (result) navigate('/results');
  };

  if (metaLoading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin w-10 h-10 border-4 rounded-full" style={{ borderColor: 'var(--color-primary-container)', borderTopColor: 'transparent' }} />
        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>Loading form data…</p>
      </div>
    </div>
  );

  return (
    <div className="py-12" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container-app max-w-4xl">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary-container)' }}
            >
              <Brain size={26} color="white" />
            </div>
          </div>
          <h1 className="text-headline-lg mb-2" style={{ color: 'var(--color-on-surface)' }}>AI College Prediction</h1>
          <p className="text-body-lg max-w-xl mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>
            Fill in your details to get a personalised list of predicted colleges based on official CAP cutoff data.
          </p>
        </div>

        {/* Backend / meta error */}
        {(metaError || predError) && (
          <div
            className="mb-6 p-4 rounded-xl text-body-sm border"
            style={{ backgroundColor: 'var(--color-error-container)', borderColor: 'var(--color-error)', color: 'var(--color-on-error-container)' }}
          >
            {metaError || predError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Main Form ── */}
            <div className="lg:col-span-2 card flex flex-col gap-6">
              <h2 className="text-headline-sm pb-4 border-b" style={{ color: 'var(--color-on-surface)', borderColor: 'var(--color-outline-variant)' }}>
                Your Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Select
                  id="course"
                  label="Course *"
                  placeholder="Select Course"
                  options={metadata?.courses && metadata.courses.length > 0 ? metadata.courses : ['B.E/B.Tech', 'MCA', 'Pharmacy']}
                  value={form.course}
                  onChange={set('course')}
                  error={errors.course}
                />

                <Select
                  id="academic_year"
                  label="Admission Year"
                  placeholder="Latest available"
                  options={metadata?.academic_years ?? []}
                  value={form.academic_year}
                  onChange={set('academic_year')}
                />
                <Input
                  id="percentile"
                  label="MHT CET Percentile *"
                  type="number"
                  min={0}
                  max={100}
                  step={0.000001}
                  placeholder="e.g. 85.5"
                  value={form.percentile}
                  onChange={set('percentile')}
                  error={errors.percentile}
                />
                <Select
                  id="category"
                  label="Category *"
                  placeholder="Select Category"
                  options={metadata?.categories ?? []}
                  value={form.category}
                  onChange={set('category')}
                  error={errors.category}
                />
                <Select
                  id="gender"
                  label="Gender"
                  placeholder="Select Gender"
                  options={metadata?.genders ?? []}
                  value={form.gender}
                  onChange={set('gender')}
                />

                <Select
                  id="home_university"
                  label="Home University"
                  placeholder="Any University"
                  options={['All', ...(metadata?.universities ?? [])]}
                  value={form.home_university}
                  onChange={set('home_university')}
                />
                <Select
                  id="district"
                  label="District"
                  placeholder="Any District"
                  options={metadata?.districts ?? []}
                  value={form.district}
                  onChange={set('district')}
                />
                <div className="sm:col-span-2">
                  <Select
                    id="preferred_branch"
                    label="Preferred Branch"
                    placeholder="Any Branch"
                    options={['All', ...(metadata?.branches ?? [])]}
                    value={form.preferred_branch}
                    onChange={set('preferred_branch')}
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={predicting}
                  className="w-full sm:w-auto"
                >
                  {predicting ? 'Predicting…' : 'Predict My Colleges →'}
                </Button>
              </div>
            </div>

            {/* ── Info Panel ── */}
            <div className="flex flex-col gap-4">
              <div className="card flex flex-col gap-4">
                <h3 className="text-headline-sm" style={{ color: 'var(--color-on-surface)' }}>How it works</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { num: '1', text: 'Fill in your percentile, category and CAP round' },
                    { num: '2', text: 'We compare against official cutoff records' },
                    { num: '3', text: 'Get Safe, Target & Dream college predictions' },
                  ].map(step => (
                    <div key={step.num} className="flex gap-3 items-start">
                      <div
                        className="flex-shrink-0 w-6 h-6 rounded-full text-center text-label-sm font-bold leading-6"
                        style={{ backgroundColor: 'var(--color-primary-container)', color: 'white', lineHeight: '24px' }}
                      >
                        {step.num}
                      </div>
                      <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{step.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card flex flex-col gap-3">
                <h3 className="text-headline-sm" style={{ color: 'var(--color-on-surface)' }}>Admission Chances</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-safe">✓ Safe</span>
                    <span className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Percentile ≥ cutoff + 2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-target">◎ Target</span>
                    <span className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Within ±2 of cutoff</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-dream">★ Dream</span>
                    <span className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Percentile &lt; cutoff − 2</span>
                  </div>
                </div>
              </div>

              <Tip>Results are based on 2023-24 CAP data. Actual cutoffs may vary in upcoming years.</Tip>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default PredictionPage;
