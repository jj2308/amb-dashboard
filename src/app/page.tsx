"use client";
import { Range } from "react-date-range";
import React, { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import { addDays, format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { MetricCard } from "../components/MetricCard";
import { LineChart } from "../components/LineChart";
import { DonutChart } from "../components/DonutChart";
import { FunnelChart } from "../components/FunnelChart";
import { CampaignTable } from "../components/CampaignTable";
import { ThemeToggle } from "../components/ThemeToggle";
import { metricsData } from "../data/metrics";
import {
  revenueTrendData,
  trafficSourcesData,
  conversionFunnelData,
} from "../data/charts";
import { campaignsData } from "../data/campaigns";
import Image from "next/image";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: addDays(new Date(), -6),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [channelFilter, setChannelFilter] = useState<string>("All");
  const statusOptions = ["All", "Active", "Paused", "Ended"];
  const channelOptions = ["All", ...Array.from(new Set(campaignsData.map(c => c.channel)))];

  // Filter campaigns by status, channel, and (mock) date range
  const filteredCampaigns = campaignsData.filter(c =>
    (statusFilter === "All" || c.status === statusFilter) &&
    (channelFilter === "All" || c.channel === channelFilter)
    // Date range filtering would go here if data had dates
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    }
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-neutral-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 flex flex-col justify-between py-5 px-3 hidden md:flex">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Image
              src="/logo.jpeg"
              alt="ADmyBRAND Logo"
              width={28}
              height={28}
              className="rounded-lg"
              priority
            />
            <img src="https://in.admybrand.com/assets/svg/web_logo.svg" alt="ADmyBRAND SVG Logo" className="h-6 w-auto" />
          </div>
          <nav className="flex flex-col gap-2">
            <a className="py-2 px-3 rounded-lg bg-blue-50 text-blue-700 font-semibold dark:bg-neutral-700 dark:text-white" href="#">Dashboard</a>
            <a className="py-2 px-3 rounded-lg hover:bg-neutral-700 hover:text-white dark:hover:bg-neutral-700 dark:hover:text-white" href="#">Analytics</a>
            <a className="py-2 px-3 rounded-lg hover:bg-neutral-700 hover:text-white dark:hover:bg-neutral-700 dark:hover:text-white" href="#">Campaigns</a>
            <a className="py-2 px-3 rounded-lg hover:bg-neutral-700 hover:text-white dark:hover:bg-neutral-700 dark:hover:text-white" href="#">Audience</a>
            <a className="py-2 px-3 rounded-lg hover:bg-neutral-700 hover:text-white dark:hover:bg-neutral-700 dark:hover:text-white" href="#">Channels</a>
            <a className="py-2 px-3 rounded-lg hover:bg-neutral-700 hover:text-white dark:hover:bg-neutral-700 dark:hover:text-white" href="#">Reports</a>
          </nav>
          <div className="mt-8">
            <div className="text-xs text-gray-400 dark:text-gray-300 uppercase mb-2">Settings</div>
            <nav className="flex flex-col gap-2">
              <a className="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 text-sm" href="#">General</a>
              <a className="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 text-sm" href="#">Notifications</a>
              <a className="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 text-sm" href="#">API Keys</a>
            </nav>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-8">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-700" />
          <div>
            <div className="font-semibold text-sm">Alex Morgan</div>
            <div className="text-xs text-gray-400 dark:text-gray-300">Marketing Director</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
            <div className="flex gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <button className="border-b-2 border-blue-600 text-blue-700 font-semibold pb-1">Overview</button>
              <button className="hover:text-blue-600">Performance</button>
              <button className="hover:text-blue-600">Conversions</button>
              <button className="hover:text-blue-600">Campaigns</button>
              <button className="hover:text-blue-600">Audience</button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input className="rounded-lg border px-3 py-1.5 text-sm bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-400 border-gray-300 dark:border-neutral-700 focus:outline-none" placeholder="Search..." />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-6 space-y-6">
          {/* Advanced Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-2">
            <div className="relative inline-block">
              <button
                ref={buttonRef}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-sm font-medium hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
                onClick={() => setShowPicker((v) => !v)}
              >
                {format(dateRange[0].startDate, "MMM d, yyyy")} - {format(dateRange[0].endDate, "MMM d, yyyy")}
              </button>
              {showPicker && (
                <div
                  ref={pickerRef}
                  className="absolute right-0 top-full mt-2 z-30 w-[320px] max-w-xs max-h-[400px] overflow-auto shadow-lg rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700"
                >
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setDateRange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={dateRange}
                    maxDate={new Date()}
                    className="shadow-lg rounded-lg"
                  />
                </div>
              )}
            </div>
            <select
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 text-sm text-gray-900 dark:text-white focus:outline-none"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 text-sm text-gray-900 dark:text-white focus:outline-none"
              value={channelFilter}
              onChange={e => setChannelFilter(e.target.value)}
            >
              {channelOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Metrics Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricsData.map((metric, idx) => (
              <MetricCard key={idx} {...metric} />
            ))}
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 shadow min-h-[300px] col-span-2">
              <LineChart
                data={revenueTrendData}
                title="Revenue Trend"
                subtitle="Monthly revenue performance"
              />
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 shadow min-h-[300px]">
              <DonutChart
                data={trafficSourcesData}
                title="Traffic Sources"
                subtitle="Top channels"
              />
            </div>
          </section>

          {/* Conversion Funnel & Table */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 shadow min-h-[250px] flex flex-col justify-between">
              <FunnelChart
                data={conversionFunnelData}
                title="Conversion Funnel"
                subtitle="User journey conversion rates"
              />
              <div className="mt-4 flex flex-col gap-2">
                <button className="self-start px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                  View full funnel report
                </button>
                <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <span>Funnel performance up by 5% compared to last week</span> <span role="img" aria-label="up">📈</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-300">
                  75% drop-off from Visits to Purchase
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 shadow min-h-[250px]">
              <CampaignTable data={filteredCampaigns} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
