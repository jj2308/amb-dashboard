import React from "react";

interface MetricCardProps {
  icon: React.ElementType;
  iconClass?: string;
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "down";
  subLabel?: string;
  progress?: number; // 0-100
  tooltip?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  iconClass = "",
  label,
  value,
  change,
  changeType,
  subLabel,
  progress,
  tooltip,
}) => {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl px-6 py-5 shadow-md dark:shadow-[0_2px_12px_rgba(0,0,0,0.5)] flex flex-col gap-3 min-h-[120px] transition-transform hover:scale-[1.02] hover:shadow-lg cursor-pointer">
      {/* Icon in colored circle */}
      {icon && (
        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-opacity-10 ${iconClass} mb-1`}>
          {React.createElement(icon, { className: `w-6 h-6 ${iconClass}` })}
        </span>
      )}
      <div className="flex items-center gap-1">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-300" title={tooltip}>{label}</div>
      </div>
      <div className="text-2xl font-semibold text-gray-900 dark:text-white leading-tight">{value}</div>
      {change && (
        <div className={`text-xs font-semibold flex items-center gap-1 mt-1 ${changeType === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
          {changeType === "up" ? <span className="text-base">▲</span> : changeType === "down" ? <span className="text-base">▼</span> : null} {change}
          <span className="text-neutral-400 font-normal ml-1">vs last month</span>
        </div>
      )}
      {subLabel && <div className="text-xs text-gray-400 dark:text-gray-300 mt-1">{subLabel}</div>}
      {typeof progress === "number" && (
        <div className="w-full h-2 bg-gray-100 dark:bg-neutral-700 rounded mt-2">
          <div
            className="h-2 rounded bg-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}; 