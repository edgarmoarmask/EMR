// components/ui.tsx
// Shared presentational components used across all pages. Tokens live in ./theme.
import type { ReactNode } from "react";
import { C, FONT, GRADIENT, avatarBg, cardStyle } from "./theme";

// ─── Components ────────────────────────────────────────────────────────────────
export function Avatar({ initials, size = 40 }: { initials: string; size?: number }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: avatarBg(initials),
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: 700, fontSize: size * 0.36,
        flexShrink: 0, fontFamily: FONT, letterSpacing: "0.02em",
      }}
    >
      {initials}
    </div>
  );
}

export function Badge({
  label, color = "#e8f4f0", text = "#2a7d6a",
}: { label: string; color?: string; text?: string }) {
  return (
    <span
      style={{
        background: color, color: text, fontSize: 11, fontWeight: 600,
        padding: "3px 10px", borderRadius: 20, fontFamily: FONT,
        letterSpacing: "0.01em", whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

/** Top bar shown at the top of every page. Right-hand actions are passed as children. */
export function Topbar({
  title, subtitle, children,
}: { title: string; subtitle: string; children?: ReactNode }) {
  return (
    <div
      style={{
        background: "#fff", borderBottom: `1px solid ${C.border}`,
        padding: "14px 28px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        gap: 16, flexShrink: 0,
      }}
    >
      <div>
        <div style={{ fontWeight: 800, fontSize: 22, color: C.text }}>{title}</div>
        <div style={{ fontSize: 13, color: C.textFaint, marginTop: 2 }}>{subtitle}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {children}
        <div
          style={{
            width: 36, height: 36, borderRadius: "50%", background: GRADIENT,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 14,
          }}
        >
          A
        </div>
      </div>
    </div>
  );
}

export function SearchBox({
  value, onChange, placeholder,
}: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 8,
        background: C.borderSoft, borderRadius: 8,
        padding: "7px 14px", border: `1px solid ${C.borderInput}`,
      }}
    >
      <span style={{ color: C.textFaint, fontSize: 15 }}>🔍</span>
      <input
        style={{
          border: "none", background: "transparent", outline: "none",
          fontSize: 13, color: C.textBody, width: 200, fontFamily: FONT,
        }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function StatCard({
  icon, label, value, hint, tone = "default",
}: {
  icon: string; label: string; value: string | number; hint?: string;
  tone?: "default" | "warn";
}) {
  return (
    <div style={{ ...cardStyle, padding: "18px 20px", display: "flex", gap: 14, alignItems: "center" }}>
      <div
        style={{
          width: 44, height: 44, borderRadius: 12, fontSize: 20,
          background: tone === "warn" ? C.warnBg : C.accentBg,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 12, color: C.textFaint, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.text, lineHeight: 1.2 }}>{value}</div>
        {hint && <div style={{ fontSize: 11.5, color: C.textMuted, marginTop: 1 }}>{hint}</div>}
      </div>
    </div>
  );
}

export function CardHeader({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div
      style={{
        padding: "16px 22px 12px", display: "flex", alignItems: "center",
        justifyContent: "space-between", borderBottom: `1px solid ${C.borderSoft}`,
      }}
    >
      <span style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{title}</span>
      {right}
    </div>
  );
}

export function Th({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        padding: "10px 0", fontSize: 11, fontWeight: 700, color: C.textFaint,
        letterSpacing: "0.06em", textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

export function Modal({
  title, onClose, children,
}: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(4px)", display: "flex",
        alignItems: "center", justifyContent: "center", zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 18, padding: 32, width: 420,
          maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 18, color: C.text, marginBottom: 20 }}>{title}</div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 5 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ padding: 32, textAlign: "center", color: C.textFaint, fontSize: 14 }}>{message}</div>
  );
}
