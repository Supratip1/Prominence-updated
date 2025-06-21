import React from "react";
import Card from "./Card";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export interface Validation {
  id: string;
  assetTitle: string;
  passed: boolean | null; // null = pending
}

export default function ValidationKanban({ items }: { items: Validation[] }) {
  const lanes = [
    { label: "Validated", icon: <CheckCircle className="w-4 h-4 text-green-400" />, filter: (v: Validation) => v.passed === true },
    { label: "Rejected",  icon: <XCircle  className="w-4 h-4 text-red-400"   />, filter: (v: Validation) => v.passed === false },
    { label: "Pending",   icon: <Clock     className="w-4 h-4 text-yellow-400" />, filter: (v: Validation) => v.passed == null },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {lanes.map(lane => (
        <Card key={lane.label}>
          <h4 className="flex items-center gap-2 text-white text-sm font-semibold mb-2">
            {lane.icon} {lane.label}
          </h4>

          <ul className="space-y-1 max-h-60 overflow-auto pr-1">
            {items.filter(lane.filter).map(v => (
              <li key={v.id} className="text-xs text-gray-300 truncate">{v.assetTitle}</li>
            ))}
            {!items.filter(lane.filter).length && (
              <p className="text-gray-500 text-xs">—</p>
            )}
          </ul>
        </Card>
      ))}
    </div>
  );
} 