import React from "react";
import Card from "./Card";

/** Doughnut-style progress indicator */
export default function ProgressPanel({ implemented, total }: { implemented: number; total: number }) {
  const pct = total ? Math.round((implemented / total) * 100) : 0;

  return (
    <Card>
      <p className="text-sm text-gray-400 mb-2">Implementation progress</p>

      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#374151" strokeWidth="4" />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#a3e635"
              strokeWidth="4"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeDashoffset="0"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-lime-400">
            {pct}%
          </span>
        </div>

        <span className="text-sm text-gray-300">
          {implemented} / {total} suggestions implemented
        </span>
      </div>
    </Card>
  );
} 