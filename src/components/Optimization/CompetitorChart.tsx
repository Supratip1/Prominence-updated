import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Card from "./Card";

export interface Series { name: string; sov: number }

export default function CompetitorChart({ data }: { data: Series[] }) {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 text-white">Share of Voice</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <Tooltip
              wrapperClassName="!text-sm !bg-gray-800 !border-0"
              contentStyle={{ background: "#1f2937", borderRadius: 6 }}
            />
            <Bar dataKey="sov" fill="#a3e635" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 