import React from "react";
import Card from "./Card";
import DeltaArrow from "./DeltaArrow";

/** Summary tile for each AI-engine score */
export interface EngineScore {
  engine: string;
  score: number;
  delta: number;
}

export default function ScoreOverview({ engineScores }: { engineScores: EngineScore[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {engineScores.map(({ engine, score, delta }) => (
        <Card key={engine}>
          <p className="text-sm text-gray-400 capitalize mb-1">{engine}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-lime-400">{score}</span>
            <DeltaArrow value={delta} />
          </div>
        </Card>
      ))}
    </div>
  );
} 