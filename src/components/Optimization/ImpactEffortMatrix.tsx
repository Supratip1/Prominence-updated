import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, Label } from 'recharts';
import { Suggestion } from './SuggestionList';

const impactMap = { low: 1, medium: 2, high: 3 };
const effortMap = { low: 1, medium: 2, high: 3 };

function getQuadrant(impact: number, effort: number) {
  if (impact === 3 && effort === 1) return 'Easy Wins';
  if (impact === 3 && effort === 2) return 'Big Bets';
  if (impact === 3 && effort === 3) return 'Moonshots';
  if (impact === 2 && effort === 1) return 'Incremental';
  if (impact === 2 && effort === 2) return 'Balanced';
  if (impact === 2 && effort === 3) return 'Challenging';
  if (impact === 1 && effort === 1) return 'Quick Fixes';
  if (impact === 1 && effort === 2) return 'Moderate';
  if (impact === 1 && effort === 3) return 'Money Pit';
  return '';
}

const quadrantLabels = [
  { x: 1.5, y: 1.5, label: 'Quick Fixes' },
  { x: 2.5, y: 1.5, label: 'Incremental' },
  { x: 1.5, y: 2.5, label: 'Moderate' },
  { x: 2.5, y: 2.5, label: 'Balanced' },
  { x: 3, y: 1.5, label: 'Easy Wins' },
  { x: 3, y: 2.5, label: 'Big Bets' },
  { x: 1.5, y: 3, label: 'Money Pit' },
  { x: 2.5, y: 3, label: 'Challenging' },
  { x: 3, y: 3, label: 'Moonshots' },
];

const quadrantFills = [
  { x1: 1, x2: 2, y1: 1, y2: 2, fill: '#222' }, // Quick Fixes
  { x1: 2, x2: 3, y1: 1, y2: 2, fill: '#444' }, // Incremental
  { x1: 1, x2: 2, y1: 2, y2: 3, fill: '#666' }, // Moderate
  { x1: 2, x2: 3, y1: 2, y2: 3, fill: '#999' }, // Balanced
  { x1: 3, x2: 3.1, y1: 1, y2: 2, fill: '#333' }, // Easy Wins
  { x1: 3, x2: 3.1, y1: 2, y2: 3, fill: '#555' }, // Big Bets
  { x1: 1, x2: 2, y1: 3, y2: 3.1, fill: '#888' }, // Money Pit
  { x1: 2, x2: 3, y1: 3, y2: 3.1, fill: '#bbb' }, // Challenging
  { x1: 3, x2: 3.1, y1: 3, y2: 3.1, fill: '#eee' }, // Moonshots
];

interface Props {
  suggestions: Suggestion[];
}

const ImpactEffortMatrix: React.FC<Props> = ({ suggestions }) => {
  const [selectedPoint, setSelectedPoint] = useState<Suggestion | null>(null);
  const [modalPos, setModalPos] = useState<{ x: number; y: number } | null>(null);

  // Use impactNum and effortNum from suggestions if present, else fallback
  const data = suggestions.map(s => ({
    ...s,
    impactNum: (s as any).impactNum ?? impactMap[s.impact as keyof typeof impactMap] ?? 2,
    effortNum: (s as any).effortNum ?? effortMap[s.effort as keyof typeof effortMap] ?? 2,
  }));

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 relative">
      {/* Graph Title */}
      <h2 className="text-2xl font-semibold text-center mb-6">Impact vs Effort Matrix</h2>
      <ResponsiveContainer width="100%" height={350}>
        <ScatterChart margin={{ top: 30, right: 40, bottom: 40, left: 40 }}>
          <CartesianGrid stroke="#bbb" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="effortNum"
            domain={[1, 3]}
            ticks={[1, 2, 3]}
            tick={{ fontSize: 18, dy: 10 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            tickFormatter={v => v === 1 ? 'Low' : v === 2 ? 'Medium' : 'High'}
          >
            <Label value="Effort" offset={-20} position="insideBottom" style={{ fontWeight: 700, fontSize: 20 }} />
          </XAxis>
          <YAxis
            type="number"
            dataKey="impactNum"
            domain={[1, 3]}
            ticks={[1, 2, 3]}
            tick={{ fontSize: 18, dx: -10 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            reversed
            tickFormatter={v => v === 1 ? 'Low' : v === 2 ? 'Medium' : 'High'}
          >
            <Label value="Impact" angle={-90} position="insideLeft" offset={-30} style={{ fontWeight: 700, fontSize: 20 }} />
          </YAxis>
          <Tooltip
            cursor={{ stroke: '#000', strokeWidth: 1, opacity: 0.2 }}
            content={({ active, payload }) => {
              if (isMobile) return null;
              if (active && payload && payload.length) {
                const s = payload[0].payload as Suggestion;
                return (
                  <div className="bg-white text-black rounded-lg shadow-lg p-4 min-w-[200px] border border-gray-200">
                    <div className="font-semibold mb-1">{s.suggestion}</div>
                    <div className="text-xs text-gray-600 mb-1">Impact: {s.impact}, Effort: {s.effort}</div>
                    {(s as any).category ? (
                      <div className="text-xs text-gray-500">Category: {(s as any).category}</div>
                    ) : null}
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter
            name="Recommendations"
            data={data}
            fill="#111"
            shape="circle"
            onClick={isMobile ? (e: any) => {
              setSelectedPoint(e.payload);
              if (e && e.cx && e.cy) {
                setModalPos({ x: e.cx, y: e.cy });
              } else {
                setModalPos(null);
              }
            } : undefined}
          />
        </ScatterChart>
      </ResponsiveContainer>
      {/* Mobile Modal */}
      {isMobile && selectedPoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className="bg-white text-black rounded-xl shadow-xl p-6 min-w-[250px] max-w-xs relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl"
              onClick={() => setSelectedPoint(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="font-semibold mb-2">{selectedPoint.suggestion}</div>
            <div className="text-xs text-gray-600 mb-1">Impact: {selectedPoint.impact}, Effort: {selectedPoint.effort}</div>
            {(selectedPoint as any).category ? (
              <div className="text-xs text-gray-500">Category: {(selectedPoint as any).category}</div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImpactEffortMatrix; 