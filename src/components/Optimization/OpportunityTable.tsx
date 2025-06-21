import React from "react";
import Card from "./Card";

export interface OpportunityRow {
  id: string;
  item: string;          // page or keyword
  engine: string;
  score: number;
  competitor: number;
  delta: number;         // competitor-score - ours
}

export default function OpportunityTable({ rows }: { rows: OpportunityRow[] }) {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 text-white">High-Impact Opportunities</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-gray-400 bg-white/5">
            <tr>
              <th className="p-2 text-left">Page / Keyword</th>
              <th className="p-2 text-left">Engine</th>
              <th className="p-2 text-left">Your Score</th>
              <th className="p-2 text-left">Best Competitor</th>
              <th className="p-2 text-left">Opportunity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t border-white/10 odd:bg-white/5">
                <td className="p-2 text-lime-300 break-all">{r.item}</td>
                <td className="p-2 capitalize">{r.engine}</td>
                <td className="p-2">{r.score}</td>
                <td className="p-2">{r.competitor}</td>
                <td className="p-2 font-medium text-red-300">+{r.delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
} 