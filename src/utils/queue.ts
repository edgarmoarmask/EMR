// utils/queue.ts
import type { QueuePriority } from "../types/clinical";

export const PRIORITY_STYLE: Record<QueuePriority, { bg: string; fg: string }> = {
  Routine: { bg: "#e8f4f0", fg: "#2a7d6a" },
  Urgent: { bg: "#fff1d6", fg: "#a86a00" },
  Emergency: { bg: "#ffe1d6", fg: "#c44a1a" },
};

export function minutesWaiting(iso: string) {
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
}
