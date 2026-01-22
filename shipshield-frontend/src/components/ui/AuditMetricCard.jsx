import { X } from "lucide-react";

const themeMap = {
  danger: {
    bar: "bg-red-500",
    badge: "bg-red-100 text-red-600",
    icon: "bg-red-100 text-red-600",
  },
  warning: {
    bar: "bg-yellow-500",
    badge: "bg-yellow-100 text-yellow-600",
    icon: "bg-yellow-100 text-yellow-600",
  },
  success: {
    bar: "bg-green-500",
    badge: "bg-green-100 text-green-600",
    icon: "bg-green-100 text-green-600",
  },
  info: {
    bar: "bg-blue-500",
    badge: "bg-blue-100 text-blue-600",
    icon: "bg-blue-100 text-blue-600",
  },
};

export default function AuditMetricCard({
  title,
  icon: Icon,
  value,
  valueLabel,
  badge,
  description,
  progress = 0,
  theme = "info",
  dismissible = false,
  onDismiss,
}) {
  const t = themeMap[theme];

  return (
    <div className="w-full rounded-2xl hover:border-[#7B5CF6] transition-colors bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${t.icon}`}>
          <Icon size={16} />
        </div>

        <span className={`text-xs px-3 py-1 rounded-full ${t.badge}`}>
          {badge}
        </span>
      </div>

      {/* Title */}
      <p className="text-sm text-gray-500">{title}</p>

      {/* Value */}
      <div className="flex items-baseline gap-2 mt-1">
        <h1 className="text-3xl text-black font-bold">{value}</h1>
        <span className="text-sm text-gray-400">{valueLabel}</span>
      </div>

      {/* Progress */}
      <div className="w-full h-2 bg-gray-100 rounded-full mt-4">
        <div
          className={`h-2 rounded-full ${t.bar}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-gray-500">{description}</p>
    </div>
  );
}
