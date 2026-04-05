"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

export function useConfetti(leaderId: string | null) {
  const prevLeaderId = useRef<string | null>(null);

  useEffect(() => {
    if (
      leaderId &&
      prevLeaderId.current &&
      prevLeaderId.current !== leaderId
    ) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.3 },
        colors: ["#FFD700", "#228B22", "#FF6B35", "#E63946", "#457B9D"],
      });
    }
    prevLeaderId.current = leaderId;
  }, [leaderId]);
}
