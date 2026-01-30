import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

const SeverityBadge = ({ severity = 'medium' }) => {
    const configs = {
        critical: {
            icon: AlertTriangle,
            bg: 'bg-red-100',
            text: 'text-red-700',
            border: 'border-red-200',
            label: 'Critical'
        },
        high: {
            icon: AlertCircle,
            bg: 'bg-orange-100',
            text: 'text-orange-700',
            border: 'border-orange-200',
            label: 'High'
        },
        medium: {
            icon: Info,
            bg: 'bg-yellow-100',
            text: 'text-yellow-700',
            border: 'border-yellow-200',
            label: 'Medium'
        },
        low: {
            icon: CheckCircle,
            bg: 'bg-blue-100',
            text: 'text-blue-700',
            border: 'border-blue-200',
            label: 'Low'
        }
    };

    const config = configs[severity.toLowerCase()] || configs.medium;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
            <Icon size={14} />
            {config.label}
        </span>
    );
};

export default SeverityBadge;
