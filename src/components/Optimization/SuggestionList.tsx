import React from "react";
import Card from "./Card";
import { Sparkles } from "lucide-react";

export interface Suggestion {
  id: string;
  assetId: string;
  type: "title" | "description" | "content" | "technical" | "structure";
  priority: "high" | "medium" | "low";
  suggestion: string;
  impact: string;
  effort: "low" | "medium" | "high";
}

const typeEmoji: Record<Suggestion["type"], string> = {
  title: "📝",
  description: "📄",
  content: "📖",
  technical: "⚙️",
  structure: "🏗️",
};

export default function SuggestionList({ suggestions }: { suggestions: Suggestion[] }) {
  if (!suggestions.length) return null;

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-lime-400" /> Suggestions
      </h3>

      <ul className="space-y-3">
        {suggestions.map(s => (
          <li key={s.id} className="bg-white/5 p-3 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <span>{typeEmoji[s.type]}</span>
              <span className="capitalize font-medium text-white text-sm">{s.type}</span>

              <span
                className={`ml-auto px-2 py-0.5 rounded-full text-xs border ${
                  s.priority === "high"
                    ? "bg-red-400/10 border-red-400/20 text-red-300"
                    : s.priority === "medium"
                    ? "bg-yellow-400/10 border-yellow-400/20 text-yellow-300"
                    : "bg-green-400/10 border-green-400/20 text-green-300"
                }`}
              >
                {s.priority}
              </span>
            </div>

            <p className="text-gray-300 text-sm mb-1">{s.suggestion}</p>
            <p className="text-xs text-purple-300">
              {s.impact} ・ effort {s.effort}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
} 