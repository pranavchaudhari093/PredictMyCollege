import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, id, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label htmlFor={id} className="text-label-md" style={{ color: 'var(--color-on-surface)' }}>
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-on-surface-variant)' }}>
          {icon}
        </span>
      )}
      <input
        id={id}
        className={`input-field ${icon ? 'pl-9' : ''} ${error ? 'border-error focus:shadow-none' : ''} ${className}`}
        {...props}
      />
    </div>
    {error && <p className="text-label-sm" style={{ color: 'var(--color-error)' }}>{error}</p>}
  </div>
);
