"use client";
import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Campaign {
  name: string;
  channel: string;
  status: string;
  budget: number;
  conversions: number;
  convRate: number;
  costPerConv: number;
  roi: number;
}

interface CampaignTableProps {
  data: Campaign[];
}

const statusOrder = { Active: 1, Paused: 2, Ended: 3 };
const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Paused: "bg-yellow-100 text-yellow-700",
  Ended: "bg-red-100 text-red-700",
};

const columns = [
  { key: "name", label: "CAMPAIGN NAME" },
  { key: "status", label: "STATUS" },
  { key: "budget", label: "BUDGET" },
  { key: "conversions", label: "CONVERSIONS" },
  { key: "convRate", label: "CONV. RATE" },
  { key: "costPerConv", label: "COST/CONV." },
  { key: "roi", label: "ROI" },
];

function compare(a: Campaign, b: Campaign, key: keyof Campaign, dir: "asc" | "desc") {
  if (key === "status") {
    const aStatus = a[key] as keyof typeof statusOrder;
    const bStatus = b[key] as keyof typeof statusOrder;
    const aVal = statusOrder[aStatus] ?? 99;
    const bVal = statusOrder[bStatus] ?? 99;
    return dir === "asc" ? aVal - bVal : bVal - aVal;
  }

  if (typeof a[key] === "number" && typeof b[key] === "number") {
    return dir === "asc" ? (a[key] as number) - (b[key] as number) : (b[key] as number) - (a[key] as number);
  }

  return dir === "asc"
    ? String(a[key]).localeCompare(String(b[key]), undefined, { sensitivity: "base" })
    : String(b[key]).localeCompare(String(a[key]), undefined, { sensitivity: "base" });
}

export const CampaignTable: React.FC<CampaignTableProps> = ({ data }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sorts, setSorts] = useState<{ key: keyof Campaign; dir: "asc" | "desc" }[]>([
    { key: "roi", dir: "desc" }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("campaignTableSorts");
    if (saved) {
      try {
        setSorts(JSON.parse(saved));
      } catch (e) {
        console.warn("Failed to parse campaignTableSorts:", e);
      }
    }
  }, []);

  const [exportOpen, setExportOpen] = useState(false);

  const pageSize = 5;

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("campaignTableSorts", JSON.stringify(sorts));
    }
  }, [sorts]);

  const filtered = data.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const sorted = React.useMemo(() => {
    if (!sorts.length) return filtered;
    return [...filtered].sort((a, b) => {
      for (const { key, dir } of sorts) {
        const cmp = compare(a, b, key, dir);
        if (cmp !== 0) return cmp;
      }
      return 0;
    });
  }, [filtered, sorts]);

  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);
  const pageCount = Math.ceil(filtered.length / pageSize);

  const handleSort = (key: keyof Campaign, e: React.MouseEvent) => {
    if (e.shiftKey) {
      setSorts((prev) => {
        const idx = prev.findIndex((s) => s.key === key);
        if (idx === -1) return [...prev, { key, dir: "asc" }];
        const newDir = prev[idx].dir === "asc" ? "desc" : "asc";
        const newSorts = [...prev];
        newSorts[idx] = { key, dir: newDir };
        return newSorts;
      });
    } else {
      setSorts((prev) => {
        if (prev[0]?.key === key) {
          return [{ key, dir: prev[0].dir === "asc" ? "desc" : "asc" }];
        }
        return [{ key, dir: "asc" }];
      });
    }
    setPage(1);
  };

  // CSV export utility
  function exportCSV() {
    const headers = [
      "Campaign Name",
      "Channel",
      "Status",
      "Budget",
      "Conversions",
      "Conv. Rate",
      "Cost/Conv.",
      "ROI",
    ];
    const rows = sorted.map((c) => [
      c.name,
      c.channel,
      c.status,
      c.budget,
      c.conversions,
      c.convRate,
      c.costPerConv,
      c.roi,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "campaigns.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // PDF export utility
  function exportPDF() {
    const doc = new jsPDF();
    const headers = [[
      "Campaign Name",
      "Channel",
      "Status",
      "Budget",
      "Conversions",
      "Conv. Rate",
      "Cost/Conv.",
      "ROI",
    ]];
    const rows = sorted.map((c) => [
      c.name,
      c.channel,
      c.status,
      c.budget,
      c.conversions,
      c.convRate,
      c.costPerConv,
      c.roi,
    ]);
    autoTable(doc, {
      head: headers,
      body: rows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] }, // Tailwind blue-600
      margin: { top: 20 },
    });
    doc.save("campaigns.pdf");
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-lg">Campaign Performance</div>
        <div className="flex items-center gap-2 relative">
          <input
            className="rounded-lg border px-3 py-1.5 text-sm bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-400 border-gray-300 dark:border-neutral-700 focus:outline-none"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <button
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-sm font-medium hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
            onClick={() => setExportOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={exportOpen}
          >
            <Download className="w-4 h-4" /> Export
          </button>
          {exportOpen && (
            <div className="absolute right-0 top-10 z-10 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-md w-40">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 text-sm"
                onClick={() => { exportCSV(); setExportOpen(false); }}
              >Export as CSV</button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 text-sm"
                onClick={() => { exportPDF(); setExportOpen(false); }}
              >Export as PDF</button>
            </div>
          )}
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-800">
        <table className="min-w-full text-sm" aria-label="Campaign Performance Table">
          <thead>
            <tr className="text-gray-500 dark:text-gray-400 text-xs">
              {columns.map((col) => {
                const sortState = sorts.find((s) => s.key === col.key);
                return (
                  <th
                    key={col.key}
                    className={`px-3 py-2 ${
                      col.key === "status" ? "text-left" : "text-right"
                    } select-none cursor-pointer hover:underline ${
                      sortState ? "bg-blue-50 dark:bg-blue-900" : ""
                    }`}
                    onClick={(e) => handleSort(col.key as keyof Campaign, e)}
                    tabIndex={0}
                    aria-label={`Sort by ${col.label}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSort(col.key as keyof Campaign, e as any);
                    }}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {sortState && (
                        <span className="inline-flex items-center">
                          {sortState.dir === "asc" ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
              <th className="px-3 py-2 text-center select-none" style={{ pointerEvents: "none", opacity: 0.5 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c, idx) => (
              <tr key={idx} className="border-t border-gray-100 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-700 transition">
                <td className="px-3 py-2 font-medium text-left">
                  <div className="flex flex-col">
                    <span>{c.name}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-300">{c.channel}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-left">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[c.status] || "bg-gray-200 text-gray-600"}`}>{c.status}</span>
                </td>
                <td className="px-3 py-2 text-right">${c.budget.toLocaleString()}</td>
                <td className="px-3 py-2 text-right">{c.conversions.toLocaleString()}</td>
                <td className="px-3 py-2 text-right">{c.convRate}%</td>
                <td className="px-3 py-2 text-right">${c.costPerConv.toFixed(2)}</td>
                <td className={`px-3 py-2 text-right font-semibold ${c.roi >= 0 ? "text-green-600" : "text-red-600"}`}>{c.roi}%</td>
                <td className="px-3 py-2 text-center">
                  <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700">
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
        <span>
          Showing {Math.min((page - 1) * pageSize + 1, filtered.length)} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} results
        </span>
        <div className="flex gap-1">
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              className={`w-7 h-7 rounded flex items-center justify-center border text-sm font-semibold ${
                page === i + 1
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
