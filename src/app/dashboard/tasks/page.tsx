"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ArrowLeft,
  ArrowRight,
  Bot,
  Sparkles,
  Loader2,
  Calendar,
} from "lucide-react";

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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filterPriority, filterStatus, search]);

  useEffect(() => {
    if (status === "authenticated") fetchTasks();
  }, [status, fetchTasks]);

  const handleStatusChange = async (task: Task, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchTasks();
        toast.success("Status updated");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTasks();
        toast.success("Task deleted");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (data: {
    title: string;
    description: string;
    priority: string;
    status: string;
    dueDate: string;
    useAI: boolean;
  }) => {
    try {
      const url = editingTask ? `/api/tasks/${editingTask.id}` : "/api/tasks";
      const method = editingTask ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        fetchTasks();
        setShowModal(false);
        setEditingTask(null);
        if (data.useAI && result.aiReasoning) {
          toast.success(
            `AI suggested ${result.priority} priority: ${result.aiReasoning}`
          );
        } else {
          toast.success(editingTask ? "Task updated" : "Task created");
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const groupedByStatus = {
    TODO: tasks.filter((t) => t.status === "TODO"),
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
    DONE: tasks.filter((t) => t.status === "DONE"),
  };

  const priorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "border-[var(--priority-high)]/20 bg-[var(--priority-high-bg)] text-[var(--priority-high)]";
      case "MEDIUM":
        return "border-[var(--priority-medium)]/20 bg-[var(--priority-medium-bg)] text-[var(--priority-medium)]";
      case "LOW":
        return "border-[var(--priority-low)]/20 bg-[var(--priority-low-bg)] text-[var(--priority-low)]";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="space-y-3 p-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[60px]" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[28px] font-extrabold"
        >
          Tasks
        </motion.h1>
        <Button
          className="bg-[#6c5ce7] text-white hover:bg-[#7c6df7]"
          onClick={() => {
            setEditingTask(null);
            setShowModal(true);
          }}
        >
          <Plus className="size-4" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative max-w-[260px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-border bg-input pl-9"
          />
        </div>
        <Select value={filterPriority} onValueChange={(val) => val && setFilterPriority(val)}>
          <SelectTrigger className="w-[160px] border-border bg-input">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Priorities</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(val) => val && setFilterStatus(val)}>
          <SelectTrigger className="w-[160px] border-border bg-input">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="TODO">Todo</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="DONE">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {(["TODO", "IN_PROGRESS", "DONE"] as const).map((col) => (
          <Card
            key={col}
            className="min-h-[400px] border-border bg-card/50 backdrop-blur-sm"
          >
            <CardContent className="p-5">
              {/* Column header */}
              <div className="mb-4 flex items-center gap-2">
                <div
                  className="size-2 rounded-full"
                  style={{
                    background:
                      col === "TODO"
                        ? "var(--status-todo)"
                        : col === "IN_PROGRESS"
                          ? "var(--status-progress)"
                          : "var(--status-done)",
                  }}
                />
                <h3 className="text-sm font-bold uppercase tracking-wide">
                  {col === "TODO"
                    ? "To Do"
                    : col === "IN_PROGRESS"
                      ? "In Progress"
                      : "Done"}
                </h3>
                <span className="ml-auto text-xs text-muted-foreground">
                  {groupedByStatus[col].length}
                </span>
              </div>

              {/* Task cards */}
              <AnimatePresence>
                {groupedByStatus[col].map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mb-2.5"
                  >
                    <Card className="group cursor-pointer transition-all duration-300 hover:-translate-y-px hover:border-[#6c5ce7]/30 hover:bg-muted/50 hover:shadow-lg hover:shadow-black/20">
                      <CardContent className="p-5">
                        {/* Top row */}
                        <div className="mb-2 flex items-start justify-between">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-semibold uppercase ${priorityBadgeClass(task.priority)}`}
                          >
                            {task.priority}
                          </Badge>
                          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => {
                                setEditingTask(task);
                                setShowModal(true);
                              }}
                            >
                              <Pencil className="size-3.5 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => handleDelete(task.id)}
                            >
                              <Trash2 className="size-3.5 text-destructive opacity-60" />
                            </Button>
                          </div>
                        </div>

                        {/* Title */}
                        <h4
                          className={`mb-1.5 text-sm font-semibold ${
                            task.status === "DONE"
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                          }`}
                        >
                          {task.title}
                        </h4>

                        {/* Description */}
                        {task.description && (
                          <p className="mb-2.5 text-xs leading-relaxed text-muted-foreground">
                            {task.description.substring(0, 80)}
                            {task.description.length > 80 ? "..." : ""}
                          </p>
                        )}

                        {/* Due date */}
                        {task.dueDate && (
                          <p className="mb-2.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Calendar className="size-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}

                        {/* Status buttons */}
                        <div className="flex gap-1">
                          {col !== "TODO" && (
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() =>
                                handleStatusChange(
                                  task,
                                  col === "IN_PROGRESS" ? "TODO" : "IN_PROGRESS"
                                )
                              }
                              className="text-[11px]"
                            >
                              <ArrowLeft className="size-3" />
                              {col === "DONE" ? "Progress" : "Todo"}
                            </Button>
                          )}
                          {col !== "DONE" && (
                            <Button
                              size="xs"
                              onClick={() =>
                                handleStatusChange(
                                  task,
                                  col === "TODO" ? "IN_PROGRESS" : "DONE"
                                )
                              }
                              className="bg-[#6c5ce7]/10 text-[11px] text-[#6c5ce7] hover:bg-[#6c5ce7]/20"
                            >
                              {col === "TODO" ? "Start" : "Complete"}
                              <ArrowRight className="size-3" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {groupedByStatus[col].length === 0 && (
                <p className="py-5 text-center text-[13px] text-muted-foreground">
                  No tasks
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task Modal */}
      <TaskModal
        open={showModal}
        task={editingTask}
        onClose={() => {
          setShowModal(false);
          setEditingTask(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}

function TaskModal({
  open,
  task,
  onClose,
  onSave,
}: {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    priority: string;
    status: string;
    dueDate: string;
    useAI: boolean;
  }) => void;
}) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "MEDIUM");
  const [taskStatus, setTaskStatus] = useState(task?.status || "TODO");
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? task.dueDate.split("T")[0] : ""
  );
  const [useAI, setUseAI] = useState(!task);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    priority: string;
    reasoning: string;
  } | null>(null);

  // Reset form when dialog opens with new task
  useEffect(() => {
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setPriority(task?.priority || "MEDIUM");
    setTaskStatus(task?.status || "TODO");
    setDueDate(task?.dueDate ? task.dueDate.split("T")[0] : "");
    setUseAI(!task);
    setAiSuggestion(null);
  }, [task, open]);

  const handleAISuggest = async () => {
    if (!title) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiSuggestion(data);
        setPriority(data.priority);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const priorityBadgeClass = (p: string) => {
    switch (p) {
      case "HIGH":
        return "border-[var(--priority-high)]/20 bg-[var(--priority-high-bg)] text-[var(--priority-high)]";
      case "MEDIUM":
        return "border-[var(--priority-medium)]/20 bg-[var(--priority-medium-bg)] text-[var(--priority-medium)]";
      case "LOW":
        return "border-[var(--priority-low)]/20 bg-[var(--priority-low-bg)] text-[var(--priority-low)]";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[520px] border-border bg-card">
        <DialogHeader>
          <DialogTitle>
            {task ? "Edit Task" : "Create Task"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border-border bg-input"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              placeholder="Add details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="border-border bg-input"
            />
          </div>

          {/* AI Priority */}
          {!task && (
            <Card className="border-[#6c5ce7]/20 bg-[#6c5ce7]/5">
              <CardContent className="p-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="ai-sparkle size-4 text-[#6c5ce7]" />
                    <span className="text-[13px] font-semibold text-[#6c5ce7]">
                      AI Priority Suggestion
                    </span>
                  </div>
                  <Switch checked={useAI} onCheckedChange={setUseAI} />
                </div>
                {useAI && (
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAISuggest}
                      disabled={!title || aiLoading}
                      className="text-xs"
                    >
                      {aiLoading ? (
                        <>
                          <Loader2 className="size-3 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="size-3" />
                          Analyze Task
                        </>
                      )}
                    </Button>
                    {aiSuggestion && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2.5 text-xs text-muted-foreground"
                      >
                        Suggested{" "}
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold uppercase ${priorityBadgeClass(aiSuggestion.priority)}`}
                        >
                          {aiSuggestion.priority}
                        </Badge>{" "}
                        — {aiSuggestion.reasoning}
                      </motion.div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(val) => val && setPriority(val)}>
                <SelectTrigger className="border-border bg-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIGH">🔴 High</SelectItem>
                  <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                  <SelectItem value="LOW">🟢 Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={taskStatus} onValueChange={(val) => val && setTaskStatus(val)}>
                <SelectTrigger className="border-border bg-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <Label>Due Date</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border-border bg-input"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="bg-[#6c5ce7] text-white hover:bg-[#7c6df7]"
              onClick={() =>
                onSave({
                  title,
                  description,
                  priority,
                  status: taskStatus,
                  dueDate,
                  useAI,
                })
              }
              disabled={!title}
            >
              {task ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
