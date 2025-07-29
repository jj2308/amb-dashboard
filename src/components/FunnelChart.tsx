"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";

interface FunnelChartProps {
  data: { stage: string; value: number; percent: number }[];
  title?: string;
  subtitle?: string;
}

export const FunnelChart: React.FC<FunnelChartProps> = ({ data, title, subtitle }) => {
  return (
    <div className="w-full h-full">
      {title && <div className="font-semibold text-lg mb-1">{title}</div>}
      {subtitle && <div className="text-xs text-gray-400 mb-2">{subtitle}</div>}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
          <XAxis type="number" hide domain={[0, data[0]?.value || 1]} />
          <YAxis type="category" dataKey="stage" tick={{ fontSize: 13 }} axisLine={false} tickLine={false} width={110} />
          <Tooltip formatter={(v: number) => v.toLocaleString()} />
          <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 8, 8]} barSize={22}>
          <LabelList
  dataKey="percent"
  position="right"
  formatter={(label: React.ReactNode) => `${Number(label)}%`}
  fill="#64748b"
  fontSize={13}
/>

          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}; 