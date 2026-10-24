// pages/AnalyticsPage.tsx
// All charts are plain CSS/SVG so no chart dependency is needed.
import { useState } from "react";
import {
  MOCK_MONTHLY_VISITS, MOCK_DIAGNOSES, MOCK_VISIT_MIX, MOCK_AGE_GROUPS,
} from "../data/mock";
import {
  CardHeader, StatCard, Topbar,
} from "../components/ui";
import {
  cardStyle, C, FONT,
} from "../components/theme";

type Range = "6m" | "3m";

function LineChart({ data }: { data: { label: string; value: number }[] }) {
  const W = 520, H = 200, padL = 36, padR = 12, padT = 14, padB = 26;
  const min = Math.min(...data.map((d) => d.value)) * 0.9;
  const max = Math.max(...data.map((d) => d.value)) * 1.05;
  const x = (i: number) => padL + (i * (W - padL - padR)) / Math.max(1, data.length - 1);
  const y = (v: number) => padT + (1 - (v - min) / (max - min)) * (H - padT - padB);
  const path = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.value)}`).join(" ");
  const area = `${path} L${x(data.length - 1)},${H - padB} L${x(0)},${H - padB} Z`;
  const ticks = [min, (min + max) / 2, max];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Monthly visits trend">
      <defs>
        <linearGradient id="visitsFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.accent} stopOpacity="0.28" />
          <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke={C.borderSoft} />
          <text x={padL - 6} y={y(t) + 4} textAnchor="end" fontSize="10" fill={C.textFaint} fontFamily={FONT}>
            {Math.round(t)}
          </text>
        </g>
      ))}
      <path d={area} fill="url(#visitsFill)" />
      <path d={path} fill="none" stroke={C.accentDark} strokeWidth="2.5" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={d.label}>
          <circle cx={x(i)} cy={y(d.value)} r="4" fill="#fff" stroke={C.accentDark} strokeWidth="2" />
          <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill={C.textFaint} fontFamily={FONT}>{d.label}</text>
        </g>
      ))}
    </svg>
  );
}

function Donut({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((a, d) => a + d.value, 0);
  const R = 52, r = 34, cx = 70, cy = 70;
  const arcs = data.map((d, i) => {
    const before = data.slice(0, i).reduce((a, x) => a + x.value, 0);
    const a0 = -Math.PI / 2 + (before / total) * Math.PI * 2;
    const sweep = (d.value / total) * Math.PI * 2;
    const a1 = a0 + sweep;
    const large = sweep > Math.PI ? 1 : 0;
    const p = (rad: number, a: number) => `${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`;
    return { ...d, path: `M${p(R, a0)} A${R},${R} 0 ${large} 1 ${p(R, a1)} L${p(r, a1)} A${r},${r} 0 ${large} 0 ${p(r, a0)} Z` };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "20px 22px" }}>
      <svg viewBox="0 0 140 140" width={140} height={140} role="img" aria-label="Visit type breakdown">
        {arcs.map((a) => <path key={a.label} d={a.path} fill={a.color} />)}
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize="15" fontWeight="800" fill={C.text} fontFamily={FONT}>{total}%</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.map((d) => (
          <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.textBody }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
            <span style={{ width: 100 }}>{d.label}</span>
            <strong style={{ color: C.text }}>{d.value}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function HBars({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
      {data.map((d) => (
        <div key={d.label}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
            <span style={{ color: C.textBody, fontWeight: 600 }}>{d.label}</span>
            <span style={{ color: C.textMuted, fontWeight: 700 }}>{d.value}</span>
          </div>
          <div style={{ height: 8, background: C.borderSoft, borderRadius: 6 }}>
            <div style={{ width: `${(d.value / max) * 100}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, ${C.accent}, ${C.accentDark})` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>("6m");
  const visits = range === "6m" ? MOCK_MONTHLY_VISITS : MOCK_MONTHLY_VISITS.slice(-3);
  const total = visits.reduce((a, v) => a + v.value, 0);
  const growth = Math.round(((visits[visits.length - 1].value - visits[0].value) / visits[0].value) * 100);
  const ageMax = Math.max(...MOCK_AGE_GROUPS.map((a) => a.value));

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Topbar title="Analytics" subtitle="Clinic activity and patient population insights">
        <div style={{ display: "flex", gap: 6 }}>
          {(["3m", "6m"] as Range[]).map((r) => (
            <button key={r} onClick={() => setRange(r)} style={{
              padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontFamily: FONT,
              fontSize: 12.5, fontWeight: 700,
              border: `1px solid ${range === r ? C.accent : C.borderInput}`,
              background: range === r ? C.accentBg : "#fff",
              color: range === r ? C.accentText : C.textMuted,
            }}>
              Last {r === "3m" ? "3" : "6"} months
            </button>
          ))}
        </div>
      </Topbar>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <StatCard icon="📈" label="Total Visits" value={total.toLocaleString()} hint={`${growth >= 0 ? "+" : ""}${growth}% over period`} />
          <StatCard icon="⏱" label="Avg Wait Time" value="18 min" hint="Target: under 20 min" />
          <StatCard icon="🔁" label="Follow-up Rate" value="27%" hint="Of all visits" />
          <StatCard icon="🚨" label="Emergency Share" value="8%" hint="Of all visits" tone="warn" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}>
          <div style={cardStyle}>
            <CardHeader title="Visits Over Time" />
            <div style={{ padding: "16px 22px 12px" }}><LineChart data={visits} /></div>
          </div>
          <div style={cardStyle}>
            <CardHeader title="Visit Types" />
            <Donut data={MOCK_VISIT_MIX} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={cardStyle}>
            <CardHeader title="Top Diagnoses" />
            <HBars data={MOCK_DIAGNOSES} />
          </div>
          <div style={cardStyle}>
            <CardHeader title="Patients by Age Group" />
            <div style={{ padding: "22px 22px 18px", display: "flex", alignItems: "flex-end", gap: 14, height: 240 }}>
              {MOCK_AGE_GROUPS.map((a) => (
                <div key={a.label} style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted }}>{a.value}</div>
                  <div style={{ width: "100%", height: Math.round((a.value / ageMax) * 150), background: "#6b7fc4", borderRadius: "6px 6px 0 0", minHeight: 4, flexShrink: 0 }} />
                  <div style={{ fontSize: 11, color: C.textFaint, fontWeight: 600 }}>{a.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
