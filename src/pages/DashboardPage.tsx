// pages/DashboardPage.tsx
import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import type { PatientListItem, Prescription, QueueEntry } from "../types/clinical";
import { MOCK_PATIENTS, MOCK_PRESCRIPTIONS, MOCK_QUEUE, MOCK_MONTHLY_VISITS } from "../data/mock";
import {
  Avatar, Badge, CardHeader, StatCard, Topbar, EmptyState,
} from "../components/ui";
import {
  cardStyle, getInitials, formatDate, C, ghostBtn,
} from "../components/theme";
import { PRIORITY_STYLE, minutesWaiting } from "../utils/queue";
import type { PageProps } from "../types/nav";

const client = generateClient<Schema>();

export default function DashboardPage({ navigate }: PageProps) {
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  // The queue has no backing model yet, so it always uses mock data.
  const queue: QueueEntry[] = MOCK_QUEUE;

  useEffect(() => {
    (async () => {
      try {
        const [pRes, rxRes] = await Promise.all([
          client.models.Patient.list(),
          client.models.Prescription.list(),
        ]);
        if (pRes.errors || !pRes.data.length) throw new Error("empty");
        setPatients(
          pRes.data.map((p) => ({
            id: p.id,
            firstName: p.firstName ?? "",
            lastName: p.lastName ?? "",
            gender: (p.gender ?? "M") as "M" | "F" | "Other",
            age: p.age ?? 0,
            emrNumber: `EMR-${p.id.slice(-4).toUpperCase()}`,
            lastVisit: p.lastVisit ?? new Date().toISOString(),
            physicianName: p.physicianName ?? "",
          }))
        );
        setPrescriptions(
          (rxRes.data ?? []).map((r) => ({
            id: r.id, patientId: r.patientId, medication: r.medication,
            dosage: r.dosage, frequency: r.frequency, prescribedBy: r.prescribedBy,
            prescribedDate: r.prescribedDate, expiryDate: r.expiryDate ?? undefined,
            status: (r.status ?? "Active") as Prescription["status"],
            allergyChecked: r.allergyChecked ?? false,
          }))
        );
      } catch {
        setPatients(MOCK_PATIENTS);
        setPrescriptions(MOCK_PRESCRIPTIONS);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const waiting = queue.filter((q) => q.status === "Waiting");
  const inConsult = queue.filter((q) => q.status === "InConsultation");
  const urgent = waiting.filter((q) => q.priority !== "Routine");
  const activeRx = prescriptions.filter((r) => r.status === "Active");
  const unchecked = activeRx.filter((r) => !r.allergyChecked);
  const avgWait = waiting.length
    ? Math.round(waiting.reduce((a, q) => a + minutesWaiting(q.arrivedAt), 0) / waiting.length)
    : 0;

  const max = Math.max(...MOCK_MONTHLY_VISITS.map((m) => m.value));
  const BAR_AREA = 130; // px available for the tallest bar

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Topbar title="Dashboard" subtitle="Today's overview for City General Clinical Portal" />

      <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <StatCard icon="👥" label="Total Patients" value={loading ? "…" : patients.length} hint="In directory" />
          <StatCard icon="⏳" label="Waiting Now" value={waiting.length} hint={`Avg wait ${avgWait} min`} />
          <StatCard icon="🩺" label="In Consultation" value={inConsult.length} hint={`${urgent.length} urgent in queue`} />
          <StatCard
            icon="💊" label="Active Prescriptions" value={loading ? "…" : activeRx.length}
            hint={unchecked.length ? `${unchecked.length} need allergy check` : "All allergy-checked"}
            tone={unchecked.length ? "warn" : "default"}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}>
          {/* Queue snapshot */}
          <div style={cardStyle}>
            <CardHeader
              title="Waiting Room"
              right={<button style={ghostBtn} onClick={() => navigate("queue")}>View queue →</button>}
            />
            {waiting.length === 0 ? (
              <EmptyState message="No patients are waiting." />
            ) : (
              waiting.slice(0, 5).map((q) => {
                const [first, ...rest] = q.patientName.split(" ");
                const pr = PRIORITY_STYLE[q.priority];
                return (
                  <div key={q.id} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 22px", borderBottom: `1px solid ${C.borderSoft}`,
                  }}>
                    <Avatar initials={getInitials(first, rest.join(" "))} size={36} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: C.text }}>{q.patientName}</div>
                      <div style={{ fontSize: 11.5, color: C.textFaint }}>{q.reason}</div>
                    </div>
                    <Badge label={q.priority} color={pr.bg} text={pr.fg} />
                    <div style={{ fontSize: 12, color: C.textMuted, width: 64, textAlign: "right" }}>
                      {minutesWaiting(q.arrivedAt)} min
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Visits chart */}
          <div style={cardStyle}>
            <CardHeader title="Monthly Visits" />
            <div style={{ padding: "22px 22px 18px", display: "flex", alignItems: "flex-end", gap: 14, height: 220 }}>
              {MOCK_MONTHLY_VISITS.map((m) => (
                <div key={m.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted }}>{m.value}</div>
                  <div style={{
                    width: "100%", height: Math.round((m.value / max) * BAR_AREA),
                    background: `linear-gradient(180deg, ${C.accent}, ${C.accentDark})`,
                    borderRadius: "6px 6px 0 0", minHeight: 4, flexShrink: 0,
                  }} />
                  <div style={{ fontSize: 11, color: C.textFaint, fontWeight: 600 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent patients */}
        <div style={cardStyle}>
          <CardHeader
            title="Recently Seen Patients"
            right={<button style={ghostBtn} onClick={() => navigate("clinical")}>Open records →</button>}
          />
          {loading ? (
            <EmptyState message="Loading…" />
          ) : (
            [...patients]
              .sort((a, b) => b.lastVisit.localeCompare(a.lastVisit))
              .slice(0, 4)
              .map((p) => (
                <div key={p.id} style={{
                  display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  alignItems: "center", padding: "12px 22px",
                  borderBottom: `1px solid ${C.borderSoft}`, fontSize: 13, color: C.textBody,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar initials={getInitials(p.firstName, p.lastName)} size={32} />
                    <span style={{ fontWeight: 700, color: C.text }}>{p.firstName} {p.lastName}</span>
                  </div>
                  <span style={{ color: "#6a9e94", fontWeight: 600, fontSize: 12 }}>#{p.emrNumber}</span>
                  <span style={{ color: C.textMuted }}>{formatDate(p.lastVisit)}</span>
                  <span style={{ color: C.textMuted }}>{p.physicianName}</span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
