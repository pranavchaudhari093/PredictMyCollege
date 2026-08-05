import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, BarChart3, Shield, BookOpen, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

// ── Feature Card ──────────────────────────────────────────────────────────────
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
}> = ({ icon, title, desc }) => (
  <div className="card flex flex-col gap-4 hover:shadow-md transition-shadow">
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-primary-fixed)' }}
    >
      {icon}
    </div>
    <div>
      <h3 className="text-headline-sm mb-1" style={{ color: 'var(--color-on-surface)' }}>{title}</h3>
      <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{desc}</p>
    </div>
  </div>
);

// ── How It Works Step ─────────────────────────────────────────────────────────
const Step: React.FC<{ num: number; title: string; desc: string }> = ({ num, title, desc }) => (
  <div className="flex gap-4 items-start">
    <div
      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-label-md font-bold"
      style={{ backgroundColor: 'var(--color-primary-container)', color: 'white' }}
    >
      {num}
    </div>
    <div>
      <h4 className="text-headline-sm mb-1" style={{ color: 'var(--color-on-surface)' }}>{title}</h4>
      <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{desc}</p>
    </div>
  </div>
);

// ── Stat Chip ─────────────────────────────────────────────────────────────────
const StatChip: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="text-center px-6 py-4 rounded-xl" style={{ backgroundColor: 'var(--color-surface-container-low)', border: '1px solid var(--color-outline-variant)' }}>
    <div className="text-headline-lg" style={{ color: 'var(--color-primary-container)' }}>{value}</div>
    <div className="text-label-md mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>{label}</div>
  </div>
);

// ── Home Page ─────────────────────────────────────────────────────────────────
const HomePage: React.FC = () => (
  <div>
    {/* ── Hero ───────────────────────────────────────────────────────────── */}
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f7f9fb 0%, #eff3ff 50%, #e8f4f1 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'var(--color-primary-fixed)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'var(--color-tertiary-container)', transform: 'translate(-30%, 30%)' }} />

      <div className="container-app py-24 md:py-32 relative">
        {/* Eyebrow badge */}
        <div className="flex justify-center mb-6">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-label-sm border"
            style={{ borderColor: 'var(--color-outline-variant)', backgroundColor: 'var(--color-surface-card)', color: 'var(--color-primary-container)' }}
          >
            <Brain size={13} /> AI-Powered College Prediction for MHT CET
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-center mb-6" style={{ color: 'var(--color-on-surface)' }}>
          <span className="text-display block">Find Your Perfect</span>
          <span className="text-display block" style={{ color: 'var(--color-primary-container)' }}>Engineering College</span>
        </h1>

        {/* Sub-heading */}
        <p className="text-body-lg text-center max-w-2xl mx-auto mb-10" style={{ color: 'var(--color-on-surface-variant)' }}>
          Enter your MHT CET percentile and get instant, data-driven college predictions based on official CAP Round cutoff records from Maharashtra State.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/predict">
            <button className="btn btn-primary-lg flex items-center gap-2">
              Start Prediction <ArrowRight size={18} />
            </button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" size="lg">View Dashboard</Button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
          <StatChip value="1,000+" label="Colleges" />
          <StatChip value="3" label="CAP Rounds" />
          <StatChip value="2023-24" label="Latest Data" />
          <StatChip value="100%" label="Free" />
        </div>
      </div>
    </section>

    {/* ── Introduction ───────────────────────────────────────────────────── */}
    <section className="py-20" style={{ backgroundColor: 'var(--color-surface-card)' }}>
      <div className="container-app">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-headline-lg mb-4" style={{ color: 'var(--color-on-surface)' }}>
            What is PredictMyCollege?
          </h2>
          <p className="text-body-lg" style={{ color: 'var(--color-on-surface-variant)' }}>
            PredictMyCollege uses real CAP Round cutoff data from Maharashtra State to predict which engineering colleges
            you are likely to get admission into — based on your percentile, category, preferred branch, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {[
            'Based on official Maharashtra State CAP cutoff data',
            'Filters by category, gender, home university & district',
            'Shows Safe, Target, and Dream colleges instantly',
            'Compares all 3 CAP Round cutoffs side by side',
          ].map(point => (
            <div key={point} className="flex items-start gap-3">
              <CheckCircle size={18} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--color-tertiary-container)' }} />
              <span className="text-body-md" style={{ color: 'var(--color-on-surface)' }}>{point}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Features ───────────────────────────────────────────────────────── */}
    <section className="py-20" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container-app">
        <div className="text-center mb-12">
          <h2 className="text-headline-lg mb-4" style={{ color: 'var(--color-on-surface)' }}>Why Use PredictMyCollege?</h2>
          <p className="text-body-lg max-w-xl mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>
            Smart features built for Maharashtra engineering aspirants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Brain size={22} style={{ color: 'var(--color-primary-container)' }} />}
            title="AI-Powered Prediction"
            desc="Our engine compares your percentile against real cutoffs across all rounds to classify Safe, Target, and Dream colleges."
          />
          <FeatureCard
            icon={<BarChart3 size={22} style={{ color: 'var(--color-primary-container)' }} />}
            title="Multi-Round Cutoffs"
            desc="View CAP Round I, II, and III cutoffs side by side to understand how cutoffs shift across rounds."
          />
          <FeatureCard
            icon={<Shield size={22} style={{ color: 'var(--color-primary-container)' }} />}
            title="Category-Aware Filtering"
            desc="Filter by OPEN, OBC, SC, ST, EWS, TFWS and more — results are tailored to your specific reservation category."
          />
          <FeatureCard
            icon={<BookOpen size={22} style={{ color: 'var(--color-primary-container)' }} />}
            title="Branch Preferences"
            desc="Prefer Computer Science or Mechanical? Filter predictions by your preferred branch of engineering."
          />
          <FeatureCard
            icon={<BarChart3 size={22} style={{ color: 'var(--color-primary-container)' }} />}
            title="Location-Based Filters"
            desc="Narrow results by district and home university to find colleges closer to your preferred location."
          />
          <FeatureCard
            icon={<Brain size={22} style={{ color: 'var(--color-primary-container)' }} />}
            title="Prediction History"
            desc="Your previous predictions are saved locally so you can review and compare results anytime."
          />
        </div>
      </div>
    </section>

    {/* ── How It Works ───────────────────────────────────────────────────── */}
    <section className="py-20" style={{ backgroundColor: 'var(--color-surface-card)' }}>
      <div className="container-app">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-headline-lg mb-4" style={{ color: 'var(--color-on-surface)' }}>How Prediction Works</h2>
            <p className="text-body-lg" style={{ color: 'var(--color-on-surface-variant)' }}>
              Get your college predictions in 3 simple steps.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <Step
              num={1}
              title="Enter Your Details"
              desc="Fill in your MHT CET percentile, category, preferred branch, home university, and CAP round."
            />
            <Step
              num={2}
              title="AI Analyzes Cutoffs"
              desc="Our system compares your profile against official CAP Round cutoff data from Maharashtra State (2023-24)."
            />
            <Step
              num={3}
              title="Get Your Predictions"
              desc="Receive a ranked list of colleges categorized as Safe, Target, or Dream — with cutoffs for all 3 CAP Rounds."
            />
          </div>
        </div>
      </div>
    </section>

    {/* ── Final CTA ──────────────────────────────────────────────────────── */}
    <section
      className="py-20"
      style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)' }}
    >
      <div className="container-app text-center">
        <h2 className="text-headline-lg mb-4 text-white">Ready to Find Your College?</h2>
        <p className="text-body-lg mb-8" style={{ color: 'rgba(255,255,255,0.85)' }}>
          Enter your percentile and get instant predictions — completely free.
        </p>
        <Link to="/predict">
          <button
            className="btn inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold"
            style={{ backgroundColor: 'white', color: 'var(--color-primary-container)', fontSize: '1rem' }}
          >
            Start Prediction <ChevronRight size={18} />
          </button>
        </Link>
      </div>
    </section>
  </div>
);

export default HomePage;
