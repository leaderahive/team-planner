import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient.js";

const LOGO_SRC = "data:image/png;base64,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";

const HEADS = [
  { id: "sabeeh", name: "Sabeeh", programme: "CUET", color: "#1E8E3E", bg: "#E6F4EA" },
  { id: "naheema", name: "Naheema", programme: "Hive", color: "#1A73E8", bg: "#E8F0FE" },
  { id: "azeem", name: "Azeem", programme: "Legal", color: "#8430CE", bg: "#F3E8FD" },
];
const MEETING_COLOR = "#E37400";
const MEETING_BG = "#FEF3E0";

const STATUSES = [
  { id: "not_started", label: "Not started", color: "#5f6368", bg: "#f1f3f4" },
  { id: "in_progress", label: "In progress", color: "#B06000", bg: "#FEF3E0" },
  { id: "completed", label: "Completed", color: "#188038", bg: "#E6F4EA" },
  { id: "blocked", label: "Blocked", color: "#C5221F", bg: "#FCE8E6" },
  { id: "cancelled", label: "Cancelled", color: "#5f6368", bg: "#f1f3f4" },
];
function statusInfo(id) {
  return STATUSES.find((s) => s.id === id) || STATUSES[0];
}

const MEMBERS = [
  "Safwan", "Jazeem", "Rinsha", "Azeem", "Moosa", "Shaheer", "Aslam", "Malik",
  "Anees", "Mudassir", "Naheema", "Shahasad", "Asnah", "Basith", "Sabeeh", "Shafil",
];

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function pad(n) { return n < 10 ? "0" + n : "" + n; }
function toKey(date) { return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`; }
function fmtLong(date) {
  return date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}
function fmtShort(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Entries are stored as one flat list under a single key, each with its own
// due date (tasks) or meeting date (meetings) — this is the date the entry
// shows up on the calendar under. Tasks also carry an optional start date,
// which is informational only and does not affect placement.
export default function TeamPlanner() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(toKey(today));
  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState("task");
  const [formHead, setFormHead] = useState(HEADS[0].id);
  const [formAssignee, setFormAssignee] = useState(MEMBERS[0]);
  const [formTitle, setFormTitle] = useState("");
  const [formStatus, setFormStatus] = useState("not_started");
  const [formStart, setFormStart] = useState("");
  const [formDue, setFormDue] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchEntries = useCallback(async () => {
    const { data, error } = await supabase
      .from("entries")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      console.error("Fetch error:", error);
      return;
    }
    const mapped = (data || []).map((row) => ({
      id: row.id,
      type: row.type,
      title: row.title,
      head: row.head,
      assignee: row.assignee,
      status: row.status,
      startDate: row.start_date,
      dueDate: row.due_date,
      time: row.time,
      notes: row.notes,
    }));
    setEntries(mapped);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await fetchEntries();
      if (!cancelled) setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, [fetchEntries]);

  // Live updates: whenever anyone adds, edits, or deletes an entry, every open
  // copy of the app re-fetches automatically — no manual refresh needed.
  useEffect(() => {
    const channel = supabase
      .channel("entries-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "entries" }, () => {
        fetchEntries();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEntries]);

  // (Supabase writes happen directly in submitForm / deleteEntry / cycleStatus below —
  // each action targets exactly the row it changes, rather than rewriting one big blob.)

  const daysInGrid = (() => {
    const first = new Date(viewYear, viewMonth, 1);
    const startWeekday = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  })();

  function changeMonth(delta) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
  }

  function openForm(type) {
    setFormType(type);
    setFormAssignee(MEMBERS[0]);
    setFormTitle("");
    setFormStatus("not_started");
    setFormStart(selectedDate);
    setFormDue(selectedDate);
    setFormTime("");
    setFormNotes("");
    setFormError("");
    setShowForm(true);
  }

  async function submitForm() {
    if (!formTitle.trim()) {
      setFormError(formType === "task" ? "Enter a task name first" : "Enter a meeting title first");
      return;
    }
    if (!formDue) {
      setFormError(formType === "task" ? "Pick a due date" : "Pick a meeting date");
      return;
    }
    if (formType === "task" && formStart && formDue && formStart > formDue) {
      setFormError("Start date is after the due date");
      return;
    }
    setSaving(true);
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: formType,
      title: formTitle.trim(),
      head: formType === "task" ? formHead : null,
      assignee: formType === "task" ? formAssignee : null,
      status: formType === "task" ? formStatus : null,
      start_date: formType === "task" ? (formStart || formDue) : null,
      due_date: formDue,
      time: formTime.trim(),
      notes: formNotes.trim(),
    };
    const { error } = await supabase.from("entries").insert(entry);
    if (error) {
      console.error("Insert error:", error);
      setFormError("Couldn't save. Check your connection and try again.");
      setSaving(false);
      return;
    }
    await fetchEntries();
    setSaving(false);
    setShowForm(false);
  }

  async function deleteEntry(id) {
    const { error } = await supabase.from("entries").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error);
      return;
    }
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  async function cycleStatus(id) {
    const current = entries.find((e) => e.id === id);
    if (!current) return;
    const order = ["not_started", "in_progress", "completed", "blocked", "cancelled"];
    const currentStatus = current.status || "not_started";
    const next = order[(order.indexOf(currentStatus) + 1) % order.length];
    const { error } = await supabase.from("entries").update({ status: next }).eq("id", id);
    if (error) {
      console.error("Status update error:", error);
      return;
    }
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: next } : e)));
  }

  function headInfo(headId) {
    return HEADS.find((h) => h.id === headId) || null;
  }

  const entriesByDate = {};
  for (const e of entries) {
    const key = e.dueDate;
    if (!key) continue;
    if (!entriesByDate[key]) entriesByDate[key] = [];
    entriesByDate[key].push(e);
  }

  const selectedList = entriesByDate[selectedDate] || [];
  const selectedDateObj = new Date(selectedDate + "T00:00:00");
  const todayKey = toKey(today);

  const tasks = entries.filter((e) => e.type === "task");
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((e) => e.status === "completed").length;
  const inProgressTasks = tasks.filter((e) => e.status === "in_progress").length;
  const blockedTasks = tasks.filter((e) => e.status === "blocked").length;
  const overdueTasks = tasks.filter((e) => {
    if (!e.dueDate) return false;
    if (e.status === "completed" || e.status === "cancelled") return false;
    return e.dueDate < todayKey;
  }).length;

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: 420, margin: "0 auto", paddingBottom: 90 }}>
      <div style={{ padding: "16px 16px 8px", display: "flex", alignItems: "center", gap: 10 }}>
        <img
          src={LOGO_SRC}
          alt="Leadera logo"
          style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0 }}
        />
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: "#202124" }}>Team planner</h1>
          <p style={{ fontSize: 13, color: "#5f6368", margin: "2px 0 0" }}>
            Everyone's tasks and meetings, one place
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0 16px 12px" }}>
        {HEADS.map((h) => (
          <span key={h.id} style={{ fontSize: 11.5, fontWeight: 600, color: "#fff", background: h.color, padding: "3px 9px", borderRadius: 999 }}>
            {h.name} · {h.programme}
          </span>
        ))}
        <span style={{ fontSize: 11.5, fontWeight: 600, color: "#fff", background: MEETING_COLOR, padding: "3px 9px", borderRadius: 999 }}>
          Meetings
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 6, padding: "0 16px 14px" }}>
        <SummaryStat label="Total" value={totalTasks} color="#202124" />
        <SummaryStat label="Completed" value={completedTasks} color="#188038" />
        <SummaryStat label="In progress" value={inProgressTasks} color="#B06000" />
        <SummaryStat label="Overdue" value={overdueTasks} color="#C5221F" />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 16px 10px" }}>
        <button onClick={() => changeMonth(-1)} aria-label="Previous month" style={navBtnStyle}>‹</button>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#202124" }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </div>
        <button onClick={() => changeMonth(1)} aria-label="Next month" style={navBtnStyle}>›</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0 10px" }}>
        {DAY_NAMES.map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: 10.5, fontWeight: 600, color: "#70757a", padding: "2px 0" }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, padding: "4px 10px 8px" }}>
        {daysInGrid.map((date, idx) => {
          if (!date) return <div key={idx} />;
          const key = toKey(date);
          const dayItems = entriesByDate[key] || [];
          const isSelected = key === selectedDate;
          const isToday = key === todayKey;
          const dots = dayItems.slice(0, 4).map((e) => {
            if (e.type === "meeting") return MEETING_COLOR;
            const h = headInfo(e.head);
            return h ? h.color : "#5f6368";
          });
          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(key)}
              style={{
                border: "none",
                background: isSelected ? "#1a73e8" : isToday ? "#e8f0fe" : "transparent",
                borderRadius: 10, padding: "6px 2px 5px", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3, minHeight: 44,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: isToday || isSelected ? 700 : 400, color: isSelected ? "#fff" : isToday ? "#1a73e8" : "#202124" }}>
                {date.getDate()}
              </span>
              <div style={{ display: "flex", gap: 2, minHeight: 5 }}>
                {dots.map((c, i) => (
                  <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: isSelected ? "#fff" : c }} />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ padding: "10px 16px 0" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#202124", margin: "6px 0 8px" }}>
          {fmtLong(selectedDateObj)}
        </div>

        {!loaded ? (
          <div style={{ fontSize: 13, color: "#70757a", padding: "8px 0" }}>Loading…</div>
        ) : selectedList.length === 0 ? (
          <div style={{ fontSize: 13, color: "#70757a", padding: "8px 0 16px" }}>
            Nothing due here. Add a task or meeting below.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 12 }}>
            {selectedList.map((e) => {
              const isMeeting = e.type === "meeting";
              const h = headInfo(e.head);
              const color = isMeeting ? MEETING_COLOR : (h ? h.color : "#5f6368");
              const bg = isMeeting ? MEETING_BG : (h ? h.bg : "#f1f3f4");
              return (
                <div key={e.id} style={{ background: bg, borderRadius: 10, padding: "8px 10px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: "#202124", wordBreak: "break-word" }}>
                        {e.title}
                      </span>
                    </div>
                    <div style={{ fontSize: 11.5, color: "#5f6368", paddingLeft: 13 }}>
                      {isMeeting ? "Meeting" : `${e.assignee || "Unassigned"} · entered by ${h ? h.name : "Unknown"}`}
                      {e.time ? ` · ${e.time}` : ""}
                    </div>
                    {!isMeeting && (
                      <button
                        onClick={() => cycleStatus(e.id)}
                        style={{
                          marginLeft: 13, marginTop: 4, border: "none", cursor: "pointer",
                          fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 999,
                          color: statusInfo(e.status).color, background: statusInfo(e.status).bg,
                        }}
                      >
                        {statusInfo(e.status).label} · tap to change
                      </button>
                    )}
                    {!isMeeting && e.startDate && e.startDate !== e.dueDate && (
                      <div style={{ fontSize: 11.5, color: "#5f6368", paddingLeft: 13, marginTop: 1 }}>
                        Starts {fmtShort(e.startDate)} · due {fmtShort(e.dueDate)}
                      </div>
                    )}
                    {e.notes && (
                      <div style={{ fontSize: 11.5, color: "#5f6368", paddingLeft: 13, marginTop: 2 }}>
                        {e.notes}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteEntry(e.id)}
                    aria-label="Delete"
                    style={{ border: "none", background: "transparent", color: "#5f6368", fontSize: 15, cursor: "pointer", padding: 4, lineHeight: 1, flexShrink: 0 }}
                  >×</button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showForm && (
        <div style={{ padding: "0 16px 12px" }}>
          <div style={{ background: "#f8f9fa", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#202124", marginBottom: 10 }}>
              New {formType === "task" ? "task" : "meeting"}
            </div>

            {formType === "task" && (
              <>
                <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Entered by</div>
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  {HEADS.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => setFormHead(h.id)}
                      style={{
                        flex: 1, padding: "7px 4px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                        border: formHead === h.id ? `2px solid ${h.color}` : "1px solid #dadce0",
                        background: formHead === h.id ? h.bg : "#fff",
                        color: formHead === h.id ? h.color : "#5f6368",
                        cursor: "pointer",
                      }}
                    >
                      {h.name}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Assigned to</div>
                <select
                  value={formAssignee}
                  onChange={(e) => setFormAssignee(e.target.value)}
                  style={{ ...inputStyle, marginBottom: 12 }}
                >
                  {MEMBERS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>

                <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Status</div>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  style={{ ...inputStyle, marginBottom: 12 }}
                >
                  {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </>
            )}

            <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>
              {formType === "task" ? "Task name" : "Meeting title"}
            </div>
            <input
              value={formTitle}
              onChange={(e) => { setFormTitle(e.target.value); if (formError) setFormError(""); }}
              placeholder={formType === "task" ? "Prepare CUET registration list" : "Weekly sync"}
              style={inputStyle}
            />

            {formType === "task" ? (
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Start date</div>
                  <input
                    type="date"
                    value={formStart}
                    onChange={(e) => { setFormStart(e.target.value); if (formError) setFormError(""); }}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Due date</div>
                  <input
                    type="date"
                    value={formDue}
                    onChange={(e) => { setFormDue(e.target.value); if (formError) setFormError(""); }}
                    style={inputStyle}
                  />
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Date</div>
                <input
                  type="date"
                  value={formDue}
                  onChange={(e) => { setFormDue(e.target.value); if (formError) setFormError(""); }}
                  style={inputStyle}
                />
              </div>
            )}

            <div style={{ fontSize: 11, color: "#70757a", margin: "10px 0 6px" }}>Time (optional)</div>
            <input
              value={formTime}
              onChange={(e) => setFormTime(e.target.value)}
              placeholder="2:00 PM"
              style={inputStyle}
            />

            <div style={{ fontSize: 11, color: "#70757a", margin: "10px 0 6px" }}>Notes (optional)</div>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Anything worth flagging"
              rows={2}
              style={{ ...inputStyle, resize: "none" }}
            />

            {formError && (
              <div style={{ fontSize: 12, color: "#c5221f", marginTop: 8 }}>{formError}</div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button
                onClick={() => setShowForm(false)}
                style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "1px solid #dadce0", background: "#fff", color: "#5f6368", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={submitForm}
                disabled={saving}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 8, border: "none",
                  background: formType === "task" ? headInfo(formHead).color : MEETING_COLOR,
                  color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: saving ? "default" : "pointer",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {!showForm && (
        <div style={{ position: "sticky", bottom: 0, left: 0, right: 0, display: "flex", gap: 8, padding: "10px 16px", background: "#fff", borderTop: "1px solid #e8eaed" }}>
          <button
            onClick={() => openForm("task")}
            style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "none", background: "#1a73e8", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            + Add task
          </button>
          <button
            onClick={() => openForm("meeting")}
            style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "none", background: MEETING_COLOR, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            + Add meeting
          </button>
        </div>
      )}
    </div>
  );
}

function SummaryStat({ label, value, color }) {
  return (
    <div style={{ background: "#f8f9fa", borderRadius: 10, padding: "8px 6px", textAlign: "center" }}>
      <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 10, color: "#70757a", marginTop: 1 }}>{label}</div>
    </div>
  );
}

const navBtnStyle = {
  border: "none", background: "#f1f3f4", width: 32, height: 32, borderRadius: "50%",
  fontSize: 18, color: "#5f6368", cursor: "pointer", lineHeight: 1,
};

const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "9px 10px", borderRadius: 8,
  border: "1px solid #dadce0", fontSize: 13.5, fontFamily: "inherit", color: "#202124",
};
