import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

const NAV_LINKS = [
  { to: '/',          label: 'Home'       },
  { to: '/predict',   label: 'Predict'    },
  { to: '/dashboard', label: 'Dashboard'  },
];

export const Navbar: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'rgba(247,249,251,0.95)',
        borderColor: 'var(--color-outline-variant)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="container-app flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline" style={{ color: 'var(--color-on-surface)' }}>
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: 'var(--color-primary-container)' }}
          >
            <GraduationCap size={18} color="white" />
          </div>
          <span className="text-headline-sm hidden sm:block" style={{ color: 'var(--color-on-surface)' }}>
            PredictMyCollege
          </span>
          <span className="text-headline-sm sm:hidden" style={{ color: 'var(--color-on-surface)' }}>PMC</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-label-md transition-colors no-underline ${
                  isActive
                    ? 'text-primary-container bg-surface-container'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-primary-container)' : 'var(--color-on-surface-variant)',
                backgroundColor: isActive ? 'var(--color-surface-container)' : undefined,
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/predict">
            <Button variant="primary" size="sm">Start Prediction</Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: 'var(--color-on-surface)' }}
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="md:hidden border-t"
          style={{ borderColor: 'var(--color-outline-variant)', backgroundColor: 'var(--color-surface-card)' }}
        >
          <div className="container-app py-4 flex flex-col gap-2">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-body-md no-underline"
                style={({ isActive }) => ({
                  color: isActive ? 'var(--color-primary-container)' : 'var(--color-on-surface)',
                  backgroundColor: isActive ? 'var(--color-surface-container)' : 'transparent',
                })}
              >
                {label}
              </NavLink>
            ))}
            <Link to="/predict" onClick={() => setOpen(false)}>
              <Button variant="primary" size="md" className="w-full mt-2">Start Prediction</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
