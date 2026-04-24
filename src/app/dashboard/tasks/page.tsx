"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function TasksPage() {
  const { status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterPriority !== "ALL") params.set("priority", filterPriority);
      if (filterStatus !== "ALL") params.set("status", filterStatus);
      if (search) params.set("search", search);
      const res = await fetch(`/api/tasks?${params}`);
      if (res.ok) setTasks(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filterPriority, filterStatus, search]);

  useEffect(() => {
    if (status === "authenticated") fetchTasks();
  }, [status, fetchTasks]);

  const showToast = (message: string, type: string) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = async (task: Task, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) { fetchTasks(); showToast("Status updated", "success"); }
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (res.ok) { fetchTasks(); showToast("Task deleted", "success"); }
    } catch (e) { console.error(e); }
  };

  const handleSave = async (data: { title: string; description: string; priority: string; status: string; dueDate: string; useAI: boolean }) => {
    try {
      const url = editingTask ? `/api/tasks/${editingTask.id}` : "/api/tasks";
      const method = editingTask ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) {
        const result = await res.json();
        fetchTasks();
        setShowModal(false);
        setEditingTask(null);
        if (data.useAI && result.aiReasoning) {
          showToast(`AI suggested ${result.priority} priority: ${result.aiReasoning}`, "success");
        } else {
          showToast(editingTask ? "Task updated" : "Task created", "success");
        }
      }
    } catch (e) { console.error(e); }
  };

  const groupedByStatus = {
    TODO: tasks.filter(t => t.status === "TODO"),
    IN_PROGRESS: tasks.filter(t => t.status === "IN_PROGRESS"),
    DONE: tasks.filter(t => t.status === "DONE"),
  };

  if (loading) return <div style={{ padding: 32 }}>{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 60, marginBottom: 12 }} />)}</div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 28, fontWeight: 800 }}>Tasks</motion.h1>
        <button className="btn-primary" onClick={() => { setEditingTask(null); setShowModal(true); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          New Task
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <input className="input-field" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 260 }} />
        <select className="select-field" value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ maxWidth: 160 }}>
          <option value="ALL">All Priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <select className="select-field" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ maxWidth: 160 }}>
          <option value="ALL">All Statuses</option>
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      {/* Kanban Board */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        {(["TODO", "IN_PROGRESS", "DONE"] as const).map(col => (
          <div key={col} className="kanban-column">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: col === "TODO" ? "var(--status-todo)" : col === "IN_PROGRESS" ? "var(--status-progress)" : "var(--status-done)" }} />
              <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {col === "TODO" ? "To Do" : col === "IN_PROGRESS" ? "In Progress" : "Done"}
              </h3>
              <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: "auto" }}>{groupedByStatus[col].length}</span>
            </div>
            <AnimatePresence>
              {groupedByStatus[col].map(task => (
                <motion.div key={task.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="task-card" style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => { setEditingTask(task); setShowModal(true); }} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(task.id)} style={{ background: "none", border: "none", color: "var(--priority-high)", cursor: "pointer", padding: 4, opacity: 0.6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                      </button>
                    </div>
                  </div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: task.status === "DONE" ? "var(--text-muted)" : "var(--text-primary)", textDecoration: task.status === "DONE" ? "line-through" : "none" }}>{task.title}</h4>
                  {task.description && <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.5 }}>{task.description.substring(0, 80)}{task.description.length > 80 ? "..." : ""}</p>}
                  {task.dueDate && <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10 }}>📅 {new Date(task.dueDate).toLocaleDateString()}</p>}
                  <div style={{ display: "flex", gap: 4 }}>
                    {col !== "TODO" && <button onClick={() => handleStatusChange(task, col === "IN_PROGRESS" ? "TODO" : "IN_PROGRESS")} style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer" }}>← {col === "DONE" ? "Progress" : "Todo"}</button>}
                    {col !== "DONE" && <button onClick={() => handleStatusChange(task, col === "TODO" ? "IN_PROGRESS" : "DONE")} style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, background: "var(--accent-soft)", border: "1px solid rgba(108,92,231,0.2)", color: "var(--accent)", cursor: "pointer" }}>{col === "TODO" ? "Start" : "Complete"} →</button>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {groupedByStatus[col].length === 0 && <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: 20 }}>No tasks</p>}
          </div>
        ))}
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {showModal && <TaskModal task={editingTask} onClose={() => { setShowModal(false); setEditingTask(null); }} onSave={handleSave} />}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className={`toast toast-${toast.type}`}>{toast.message}</motion.div>}
      </AnimatePresence>
    </div>
  );
}

function TaskModal({ task, onClose, onSave }: { task: Task | null; onClose: () => void; onSave: (data: { title: string; description: string; priority: string; status: string; dueDate: string; useAI: boolean }) => void }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "MEDIUM");
  const [taskStatus, setTaskStatus] = useState(task?.status || "TODO");
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.split("T")[0] : "");
  const [useAI, setUseAI] = useState(!task);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ priority: string; reasoning: string } | null>(null);

  const handleAISuggest = async () => {
    if (!title) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/suggest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, description }) });
      if (res.ok) {
        const data = await res.json();
        setAiSuggestion(data);
        setPriority(data.priority);
      }
    } catch (e) { console.error(e); }
    finally { setAiLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="modal-content" style={{ padding: 32 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>{task ? "Edit Task" : "Create Task"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="form-label">Title *</label>
          <input className="input-field" placeholder="What needs to be done?" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="form-label">Description</label>
          <textarea className="input-field" placeholder="Add details..." value={description} onChange={e => setDescription(e.target.value)} rows={3} />
        </div>

        {/* AI Priority */}
        {!task && (
          <div style={{ marginBottom: 20, padding: 16, background: "var(--accent-soft)", borderRadius: 12, border: "1px solid rgba(108,92,231,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="ai-sparkle">🤖</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>AI Priority Suggestion</span>
              </div>
              <div className={`toggle-switch ${useAI ? "active" : ""}`} onClick={() => setUseAI(!useAI)} />
            </div>
            {useAI && (
              <div>
                <button className="btn-secondary" onClick={handleAISuggest} disabled={!title || aiLoading} style={{ fontSize: 12, padding: "6px 14px", opacity: !title || aiLoading ? 0.5 : 1 }}>
                  {aiLoading ? "Analyzing..." : "✨ Analyze Task"}
                </button>
                {aiSuggestion && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 10, fontSize: 12, color: "var(--text-secondary)" }}>
                    Suggested <span className={`badge badge-${aiSuggestion.priority.toLowerCase()}`}>{aiSuggestion.priority}</span> — {aiSuggestion.reasoning}
                  </motion.div>
                )}
              </div>
            )}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div>
            <label className="form-label">Priority</label>
            <select className="select-field" value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="HIGH">🔴 High</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="LOW">🟢 Low</option>
            </select>
          </div>
          <div>
            <label className="form-label">Status</label>
            <select className="select-field" value={taskStatus} onChange={e => setTaskStatus(e.target.value)}>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <label className="form-label">Due Date</label>
          <input type="date" className="input-field" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onSave({ title, description, priority, status: taskStatus, dueDate, useAI })} disabled={!title}>{task ? "Update Task" : "Create Task"}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
