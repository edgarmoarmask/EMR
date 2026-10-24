// App.tsx — application shell: sidebar navigation + page routing
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import type { PageId } from "./types/nav";
import { C, FONT, GRADIENT } from "./components/theme";
import DashboardPage from "./pages/DashboardPage";
import PatientQueuePage from "./pages/PatientQueuePage";
import ClinicalRecordsPage from "./pages/ClinicalRecordsPage";
import PrescriptionsPage from "./pages/PrescriptionsPage";
import AnalyticsPage from "./pages/AnalyticsPage";

const NAV_ITEMS: { label: string; icon: string; id: PageId }[] = [
  { label: "Dashboard", icon: "⊞", id: "dashboard" },
  { label: "Patient Queue", icon: "👤", id: "queue" },
  { label: "Clinical Records", icon: "📋", id: "clinical" },
  { label: "E-Prescriptions", icon: "💊", id: "rx" },
  { label: "Analytics", icon: "📊", id: "analytics" },
];

const DEFAULT_PAGE: PageId = "dashboard";

function pageFromHash(): PageId {
  const id = window.location.hash.replace(/^#\/?/, "") as PageId;
  return NAV_ITEMS.some((n) => n.id === id) ? id : DEFAULT_PAGE;
}

const navItemStyle = (active: boolean): CSSProperties => ({
  display: "flex", alignItems: "center", gap: 10,
  padding: "10px 20px", cursor: "pointer", width: "100%",
  background: active ? C.accentBg : "transparent",
  color: active ? C.accentText : C.textMuted,
  fontWeight: active ? 700 : 500, fontSize: 13.5, fontFamily: FONT,
  border: "none", textAlign: "left",
  borderLeft: active ? `3px solid ${C.accent}` : "3px solid transparent",
  transition: "all 0.15s", userSelect: "none",
});

export default function App() {
  const [page, setPage] = useState<PageId>(pageFromHash);

  // Keep state in sync with the URL hash (back/forward buttons, deep links).
  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback((id: PageId) => {
    window.location.hash = `/${id}`;
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c5e0da; border-radius: 4px; }
      `}</style>

      <div style={{
        display: "flex", height: "100vh", background: C.bg,
        fontFamily: FONT, overflow: "hidden", textAlign: "left",
      }}>
        {/* ── Sidebar ─────────────────────────────────── */}
        <aside style={{
          width: 240, background: "#fff", borderRight: `1px solid ${C.border}`,
          display: "flex", flexDirection: "column", flexShrink: 0,
        }}>
          <div style={{
            padding: "20px 20px 18px", borderBottom: `1px solid ${C.borderSoft}`,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: GRADIENT,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>🏥</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: C.text, lineHeight: 1.2 }}>City General</div>
              <div style={{ fontSize: 11, color: C.textFaint, fontWeight: 500 }}>Clinical Portal</div>
            </div>
          </div>

          <nav style={{ padding: "16px 0", flex: 1 }}>
            {NAV_ITEMS.map((n) => (
              <button
                key={n.id}
                style={navItemStyle(n.id === page)}
                onClick={() => navigate(n.id)}
                aria-current={n.id === page ? "page" : undefined}
              >
                <span style={{ fontSize: 16 }}>{n.icon}</span>
                {n.label}
              </button>
            ))}
          </nav>

          <div style={{ borderTop: `1px solid ${C.borderSoft}`, padding: "16px 0" }}>
            <button style={navItemStyle(false)}><span style={{ fontSize: 16 }}>💬</span>Support</button>
            <button style={navItemStyle(false)}><span style={{ fontSize: 16 }}>🚪</span>Logout</button>
          </div>
        </aside>

        {/* ── Active page ─────────────────────────────── */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          {page === "dashboard" && <DashboardPage navigate={navigate} />}
          {page === "queue" && <PatientQueuePage />}
          {page === "clinical" && <ClinicalRecordsPage />}
          {page === "rx" && <PrescriptionsPage />}
          {page === "analytics" && <AnalyticsPage />}
        </main>
      </div>
    </>
  );
}
