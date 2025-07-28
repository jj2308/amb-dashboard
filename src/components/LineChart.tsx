"use client";
import React from "react";
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from "recharts";

interface LineChartProps {
  data: { month: string; revenue: number }[];
  title?: string;
  subtitle?: string;
}

export const LineChart: React.FC<LineChartProps> = ({ data, title, subtitle }) => {
  return (
    <div className="w-full h-full">
      {title && <div className="font-semibold text-lg mb-1">{title}</div>}
      {subtitle && <div className="text-xs text-gray-400 mb-2">{subtitle}</div>}
      <ResponsiveContainer width="100%" height={260}>
        <ReLineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
          <Tooltip formatter={v => `$${v}`} />
          <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
          <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} activeDot={{ r: 5 }} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}; 