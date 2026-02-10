"use client";

import { useEffect, useState } from "react";
import TaskQueue from "@/components/TaskQueue";
import ActiveWork from "@/components/ActiveWork";
import CompletedTasks from "@/components/CompletedTasks";
import ActivityLog from "@/components/ActivityLog";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "queued" | "in-progress" | "done" | "blocked";
  deadline?: string;
  createdAt: string;
  completedAt?: string | null;
}

interface ApiResponse {
  tasks: Task[];
  activityLog: any[];
}

export default function Dashboard() {
  const [data, setData] = useState<ApiResponse>({
    tasks: [],
    activityLog: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Fetch tasks on component mount and then poll every 5s
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const newData = await response.json();
        setData(newData);
        setLoading(false);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    };

    fetchTasks();

    // Poll every 5 seconds
    const interval = setInterval(fetchTasks, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateTask = async (task: Omit<Task, "id" | "createdAt">) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      if (!response.ok) throw new Error("Failed to create task");

      // Refresh data
      const tasksResponse = await fetch("/api/tasks");
      const newData = await tasksResponse.json();
      setData(newData);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update task");

      // Refresh data
      const tasksResponse = await fetch("/api/tasks");
      const newData = await tasksResponse.json();
      setData(newData);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Delete this task?")) return;

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");

      // Refresh data
      const tasksResponse = await fetch("/api/tasks");
      const newData = await tasksResponse.json();
      setData(newData);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  // Calculate stats
  const stats = {
    completed: data.tasks.filter((t) => t.status === "done").length,
    inProgress: data.tasks.filter((t) => t.status === "in-progress").length,
    queued: data.tasks.filter((t) => t.status === "queued").length,
    blocked: data.tasks.filter((t) => t.status === "blocked").length,
  };

  // Get active task (first in-progress)
  const activeTask = data.tasks.find((t) => t.status === "in-progress") || null;

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[2000px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-100">
                Alex Command Center
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Task Management & Progress Tracking
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-6 py-3">
          Error: {error}
        </div>
      )}

      {/* Main Content - Three Column Layout */}
      <div className="max-w-[2000px] mx-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-[600px] text-slate-400">
            Loading tasks...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Left: Task Queue */}
            <div className="lg:col-span-1 overflow-hidden">
              <TaskQueue
                tasks={data.tasks}
                onCreateTask={handleCreateTask}
                onStatusChange={handleStatusChange}
                onDeleteTask={handleDeleteTask}
              />
            </div>

            {/* Center: Active Work + Activity Log */}
            <div className="lg:col-span-1 flex flex-col gap-6 overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <ActiveWork
                  task={activeTask}
                  stats={stats}
                  onStatusChange={handleStatusChange}
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <ActivityLog entries={data.activityLog} />
              </div>
            </div>

            {/* Right: Completed Tasks */}
            <div className="lg:col-span-1 overflow-hidden">
              <CompletedTasks
                tasks={data.tasks}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
