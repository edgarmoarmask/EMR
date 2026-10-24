// components/theme.ts
// Design tokens, shared style objects and helpers (kept separate from components for fast refresh).
import type { CSSProperties } from "react";

// ─── Tokens (same palette as the original Clinical Records page) ───────────────
export const FONT = "'DM Sans', 'Segoe UI', sans-serif";

export const C = {
  bg: "#f5f8f7",
  card: "#fff",
  border: "#e0ebe8",
  borderSoft: "#f0f5f3",
  borderInput: "#dce9e5",
  text: "#1a3a34",
  textBody: "#2a4a44",
  textMuted: "#5a7a74",
  textFaint: "#7fa89e",
  accent: "#2dc9a8",
  accentDark: "#1a9e84",
  accentText: "#1a7a64",
  accentBg: "#e8f5f1",
  rowActive: "#edf7f4",
  panel: "#f5faf8",
  warnBg: "#fff5f0",
  warnBorder: "#ffd6c0",
  warnText: "#c44a1a",
};

export const GRADIENT = `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`;

export const cardStyle: CSSProperties = {
  background: C.card,
  borderRadius: 16,
  border: `1px solid ${C.border}`,
  boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
  overflow: "hidden",
};

export const primaryBtn: CSSProperties = {
  background: GRADIENT,
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "9px 18px",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontFamily: FONT,
  boxShadow: "0 2px 8px rgba(45,201,168,0.25)",
};

export const ghostBtn: CSSProperties = {
  background: "none",
  border: `1px solid ${C.borderInput}`,
  borderRadius: 8,
  padding: "6px 12px",
  cursor: "pointer",
  fontSize: 12.5,
  fontWeight: 600,
  color: C.textMuted,
  fontFamily: FONT,
};

export const inputStyle: CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  border: `1px solid ${C.borderInput}`,
  borderRadius: 9,
  fontSize: 13,
  fontFamily: FONT,
  outline: "none",
  color: C.text,
  background: "#fff",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
export function getInitials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

const AVATAR_COLORS = ["#4f9d8f", "#6b7fc4", "#c46b9a", "#c49a6b", "#6b8fc4", "#8a6bc4"];

export function avatarBg(initials: string) {
  let h = 0;
  for (const ch of initials) h = (h * 31 + ch.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

