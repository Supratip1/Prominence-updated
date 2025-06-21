import React, { PropsWithChildren } from "react";

/** A glassy dark card wrapper used across the optimisation UI */
export default function Card({ children }: PropsWithChildren<{}>) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-md">
      {children}
    </div>
  );
} 