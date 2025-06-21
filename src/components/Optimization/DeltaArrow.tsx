import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

/** Green ↑ if positive, red ↓ if negative, grey – if zero  */
export default function DeltaArrow({ value }: { value: number }) {
  if (value > 0)
    return <ArrowUpRight className="w-4 h-4 text-green-400" title={`+${value}`} />;
  if (value < 0)
    return <ArrowDownRight className="w-4 h-4 text-red-400" title={`${value}`} />;
  return <Minus className="w-4 h-4 text-gray-400" />;
} 