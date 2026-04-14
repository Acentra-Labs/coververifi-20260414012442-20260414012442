import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function RAGStatusBadge({ status, size = 'md', showLabel = true }) {
  const configs = {
    green: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: CheckCircle2,
      label: 'Compliant'
    },
    yellow: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: AlertTriangle,
      label: 'Expiring Soon'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: XCircle,
      label: 'Expired'
    }
  };

  const config = configs[status] || configs.red;
  const Icon = config.icon;
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 24 : 18;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${config.bg} ${config.border} ${config.text}`}>
      <Icon size={iconSize} className="flex-shrink-0" />
      {showLabel && <span className={`text-sm font-medium`}>{config.label}</span>}
    </div>
  );
}
