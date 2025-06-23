import React from "react";
import Card from "./Card";
import { Sparkles } from "lucide-react";
import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

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

const SuggestionList: React.FC<{ suggestions: Suggestion[] }> = ({ suggestions }) => {
  if (!suggestions.length) {
    return (
      <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/10">
        <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-300">No optimization suggestions available.</p>
        <p className="text-gray-400 text-sm">Run scoring and validation to generate suggestions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-normal mb-4 text-white flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-400" />
        Top Suggestions
      </h3>
      {suggestions.map((s, index) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white/5 p-3 rounded-lg border border-white/10"
        >
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
        </motion.div>
      ))}
    </div>
  );
};

export default SuggestionList; 