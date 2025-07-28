"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  title?: string;
  subtitle?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, title, subtitle }) => {
  return (
    <div className="w-full h-full">
      {title && <div className="font-semibold text-lg mb-1">{title}</div>}
      {subtitle && <div className="text-xs text-gray-400 mb-2">{subtitle}</div>}
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            label={false}
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => v.toLocaleString()} />
          <Legend verticalAlign="bottom" height={36} iconType="circle"/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}; 