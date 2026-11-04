"use client";

import { Download } from "lucide-react";

import { generateFullReport, type ReportData } from "@/lib/report-generator";

export function ReportDownloadButton({ data }: { data: ReportData }) {
  const download = () => {
    const html = generateFullReport(data);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kllctrs-report-${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={download}
      className="inline-flex items-center gap-2 rounded-lg bg-[#8B5CF6] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#7729F1]"
    >
      <Download className="size-4" /> Download report
    </button>
  );
}
