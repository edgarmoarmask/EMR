// pages/PatientQueuePage.tsx
import { useMemo, useState } from "react";
import type { QueueEntry, QueuePriority, QueueStatus } from "../types/clinical";
import { MOCK_QUEUE } from "../data/mock";
import { PRIORITY_STYLE, minutesWaiting } from "../utils/queue";
import {
  Avatar, Badge, CardHeader, Th, Topbar, SearchBox, Modal, Field, EmptyState,
} from "../components/ui";
import {
  cardStyle, getInitials, inputStyle, primaryBtn, ghostBtn, C, FONT,
} from "../components/theme";

const STATUS_LABEL: Record<QueueStatus, string> = {
  Waiting: "Waiting",
  InConsultation: "In Consultation",
  Completed: "Completed",
};

const PRIORITY_RANK: Record<QueuePriority, number> = { Emergency: 0, Urgent: 1, Routine: 2 };

const FILTERS: Array<QueueStatus | "All"> = ["All", "Waiting", "InConsultation", "Completed"];

export default function PatientQueuePage() {
  // No Queue model exists in the Amplify schema yet, so this page is state-only.
  // Swap `useState(MOCK_QUEUE)` for client.models.QueueEntry.list() once a model is added.
  const [queue, setQueue] = useState<QueueEntry[]>(MOCK_QUEUE);
  const [filter, setFilter] = useState<QueueStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [showCheckIn, setShowCheckIn] = useState(false);

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    return queue
      .filter((e) => filter === "All" || e.status === filter)
      .filter((e) =>
        e.patientName.toLowerCase().includes(q) ||
        e.reason.toLowerCase().includes(q) ||
        e.physicianName.toLowerCase().includes(q))
      .sort((a, b) => {
        // Completed last; otherwise by priority, then by arrival time.
        if ((a.status === "Completed") !== (b.status === "Completed")) return a.status === "Completed" ? 1 : -1;
        const byPriority = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
        return byPriority || a.arrivedAt.localeCompare(b.arrivedAt);
      });
  }, [queue, filter, search]);

  const counts = (s: QueueStatus) => queue.filter((e) => e.status === s).length;

  const advance = (id: string) =>
    setQueue((qs) =>
      qs.map((e) => {
        if (e.id !== id) return e;
        const next: QueueStatus = e.status === "Waiting" ? "InConsultation" : "Completed";
        return { ...e, status: next };
      })
    );

  const handleCheckIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setQueue((qs) => [
      ...qs,
      {
        id: `q${Date.now()}`,
        patientId: `new-${Date.now()}`,
        patientName: String(fd.get("name")),
        age: Number(fd.get("age")),
        gender: fd.get("gender") as "M" | "F" | "Other",
        reason: String(fd.get("reason")),
        physicianName: String(fd.get("physician")),
        priority: fd.get("priority") as QueuePriority,
        status: "Waiting",
        arrivedAt: new Date().toISOString(),
      },
    ]);
    setShowCheckIn(false);
  };

  const cols = "2.2fr 2fr 1.2fr 1fr 1.2fr 1fr 120px";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Topbar title="Patient Queue" subtitle="Live view of patients waiting and in consultation">
        <SearchBox value={search} onChange={setSearch} placeholder="Search queue" />
        <button style={primaryBtn} onClick={() => setShowCheckIn(true)}>
          <span style={{ fontSize: 18 }}>+</span> Check In Patient
        </button>
      </Topbar>

      <div style={{ flex: 1, overflow: "hidden", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Status filter tabs */}
        <div style={{ display: "flex", gap: 10 }}>
          {FILTERS.map((f) => {
            const active = filter === f;
            const n = f === "All" ? queue.length : counts(f);
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "8px 16px", borderRadius: 10, cursor: "pointer",
                  fontFamily: FONT, fontSize: 13, fontWeight: 700,
                  border: `1px solid ${active ? C.accent : C.borderInput}`,
                  background: active ? C.accentBg : "#fff",
                  color: active ? C.accentText : C.textMuted,
                }}
              >
                {f === "All" ? "All" : STATUS_LABEL[f]} <span style={{ opacity: 0.7 }}>({n})</span>
              </button>
            );
          })}
        </div>

        <div style={{ ...cardStyle, flex: 1, display: "flex", flexDirection: "column" }}>
          <CardHeader title="Today's Queue" />
          <div style={{ flex: 1, overflowY: "auto" }}>
            <div style={{
              display: "grid", gridTemplateColumns: cols, padding: "0 22px",
              borderBottom: `1px solid ${C.borderSoft}`, background: "#fafcfb",
            }}>
              <Th>Patient</Th><Th>Reason</Th><Th>Physician</Th><Th>Waiting</Th><Th>Priority</Th><Th>Status</Th><Th />
            </div>

            {visible.length === 0 ? (
              <EmptyState message="No patients match this view." />
            ) : (
              visible.map((e) => {
                const [first, ...rest] = e.patientName.split(" ");
                const pr = PRIORITY_STYLE[e.priority];
                const done = e.status === "Completed";
                return (
                  <div key={e.id} style={{
                    display: "grid", gridTemplateColumns: cols, padding: "0 22px",
                    alignItems: "center", borderBottom: `1px solid #f5f8f7`,
                    opacity: done ? 0.6 : 1,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 0" }}>
                      <Avatar initials={getInitials(first, rest.join(" "))} size={36} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: C.text }}>{e.patientName}</div>
                        <div style={{ fontSize: 11.5, color: C.textFaint }}>{e.gender}, {e.age} yrs</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: C.textBody }}>{e.reason}</div>
                    <div style={{ fontSize: 13, color: C.textMuted }}>{e.physicianName}</div>
                    <div style={{ fontSize: 13, color: C.textMuted }}>
                      {done ? "—" : `${minutesWaiting(e.arrivedAt)} min`}
                    </div>
                    <div><Badge label={e.priority} color={pr.bg} text={pr.fg} /></div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: done ? C.textFaint : C.accentText }}>
                      {STATUS_LABEL[e.status]}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {!done && (
                        <button style={ghostBtn} onClick={() => advance(e.id)}>
                          {e.status === "Waiting" ? "Start" : "Complete"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {showCheckIn && (
        <Modal title="Check In Patient" onClose={() => setShowCheckIn(false)}>
          <form onSubmit={handleCheckIn}>
            <Field label="Patient Name"><input name="name" required style={inputStyle} /></Field>
            <Field label="Age"><input name="age" type="number" min={0} required style={inputStyle} /></Field>
            <Field label="Gender">
              <select name="gender" style={inputStyle}>
                <option value="F">Female</option><option value="M">Male</option><option value="Other">Other</option>
              </select>
            </Field>
            <Field label="Reason for Visit"><input name="reason" required style={inputStyle} /></Field>
            <Field label="Physician"><input name="physician" required defaultValue="Dr. Sterling" style={inputStyle} /></Field>
            <Field label="Priority">
              <select name="priority" style={inputStyle}>
                <option value="Routine">Routine</option><option value="Urgent">Urgent</option><option value="Emergency">Emergency</option>
              </select>
            </Field>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
              <button type="button" style={{ ...ghostBtn, padding: "9px 20px", fontSize: 13 }} onClick={() => setShowCheckIn(false)}>Cancel</button>
              <button type="submit" style={{ ...primaryBtn, padding: "9px 22px", boxShadow: "none" }}>Add to Queue</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
