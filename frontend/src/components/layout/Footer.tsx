import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer
    className="border-t mt-auto"
    style={{ borderColor: 'var(--color-outline-variant)', backgroundColor: 'var(--color-surface-container-low)' }}
  >
    <div className="container-app py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="flex items-center justify-center w-7 h-7 rounded-lg"
              style={{ backgroundColor: 'var(--color-primary-container)' }}
            >
              <GraduationCap size={16} color="white" />
            </div>
            <span className="text-headline-sm" style={{ color: 'var(--color-on-surface)' }}>PredictMyCollege</span>
          </div>
          <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            AI-powered college prediction for Maharashtra MHT CET students. Powered by official CAP Round cutoff data.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-label-md mb-3" style={{ color: 'var(--color-on-surface)' }}>Quick Links</h4>
          <ul className="flex flex-col gap-2">
            {[
              { to: '/',          label: 'Home'       },
              { to: '/predict',   label: 'Predict'    },
              { to: '/dashboard', label: 'Dashboard'  },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-body-sm no-underline hover:underline"
                  style={{ color: 'var(--color-on-surface-variant)' }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Data Source */}
        <div>
          <h4 className="text-label-md mb-3" style={{ color: 'var(--color-on-surface)' }}>Data Source</h4>
          <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            Prediction data sourced from Maharashtra State Official CAP Round cutoff records (2023-24).
          </p>
        </div>
      </div>

      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t"
        style={{ borderColor: 'var(--color-outline-variant)' }}
      >
        <p className="text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
          © {new Date().getFullYear()} PredictMyCollege. For informational purposes only.
        </p>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-label-sm no-underline"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          <ExternalLink size={14} /> View on GitHub
        </a>
      </div>
    </div>
  </footer>
);
