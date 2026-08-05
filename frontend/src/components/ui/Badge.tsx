import React from 'react';

type ChanceType = 'safe' | 'target' | 'dream' | 'unknown';

interface BadgeProps {
  chance: ChanceType;
  className?: string;
}

const labels: Record<ChanceType, string> = {
  safe:    '✓ Safe',
  target:  '◎ Target',
  dream:   '★ Dream',
  unknown: '? Unknown',
};

export const Badge: React.FC<BadgeProps> = ({ chance, className = '' }) => (
  <span className={`badge badge-${chance} ${className}`}>
    {labels[chance]}
  </span>
);
