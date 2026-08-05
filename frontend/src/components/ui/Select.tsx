import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: string[] | { value: string; label: string }[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label, error, options, placeholder, id, className = '', ...props
}) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label htmlFor={id} className="text-label-md" style={{ color: 'var(--color-on-surface)' }}>
        {label}
      </label>
    )}
    <select
      id={id}
      className={`input-field appearance-none bg-white ${error ? 'border-error' : ''} ${className}`}
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23737686' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', paddingRight: '2.5rem' }}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => {
        const value = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        return <option key={value} value={value}>{label}</option>;
      })}
    </select>
    {error && <p className="text-label-sm" style={{ color: 'var(--color-error)' }}>{error}</p>}
  </div>
);
