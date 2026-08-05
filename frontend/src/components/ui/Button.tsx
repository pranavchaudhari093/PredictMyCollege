import React from 'react';

type Variant = 'primary' | 'outline' | 'ghost';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: React.ReactNode;
}

const sizeMap: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

const variantMap: Record<Variant, string> = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  ghost:   'btn-ghost',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size    = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}) => (
  <button
    {...props}
    disabled={disabled || loading}
    className={`btn ${variantMap[variant]} ${sizeMap[size]} ${className} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''}`}
  >
    {loading && (
      <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    )}
    {children}
  </button>
);
