"use client";

import { useEffect, useState } from "react";
import TaskQueue from "@/components/TaskQueue";
import ActiveWork from "@/components/ActiveWork";
import CompletedTasks from "@/components/CompletedTasks";
import ActivityLog from "@/components/ActivityLog";
import AgentList from "@/components/AgentList";
import SpawnAgentDialog from "@/components/SpawnAgentDialog";
import MultiAgentView from "@/components/MultiAgentView";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "queued" | "in-progress" | "done" | "blocked";
  deadline?: string;
  createdAt: string;
  completedAt?: string | null;
  agentId?: string;
}

interface AgentMetadata {
  id: string;
  label: string;
  status: "idle" | "active" | "completed" | "error";
  spawnedTime: string;
  lastActivityTime: string;
  currentTask?: string;
  taskCount: number;
  completedCount: number;
}

interface ApiResponse {
  tasks: Task[];
  agents?: Record<string, AgentMetadata>;
  activityLog: any[];
}

interface AgentsResponse {
  agents: Record<string, AgentMetadata>;
  lastUpdated: string;
}

export default function Dashboard() {
  const [data, setData] = useState<ApiResponse>({
    tasks: [],
    activityLog: [],
  });
  const [agents, setAgents] = useState<Record<string, AgentMetadata>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [showSpawnDialog, setShowSpawnDialog] = useState(false);
  const [spawnLoading, setSpawnLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"agent" | "global">("global");

  // Fetch tasks and agents on component mount and then poll every 5s
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, agentsRes] = await Promise.all([
          fetch("/api/tasks"),
          fetch("/api/agents"),
        ]);

        if (!tasksRes.ok) throw new Error("Failed to fetch tasks");
        if (!agentsRes.ok) throw new Error("Failed to fetch agents");

        const newData = await tasksRes.json();
        const agentsData = await agentsRes.json();

        setData(newData);
        setAgents(agentsData.agents || {});
        setLoading(false);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    };

    fetchData();

    // Poll every 5 seconds
    const interval = setInterval(fetchData, 5000);

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

  const handleSpawnAgent = async (formData: {
    label: string;
    taskDescription: string;
  }) => {
    setSpawnLoading(true);
    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to spawn agent");

      // Refresh agents
      const agentsResponse = await fetch("/api/agents");
      const agentsData = await agentsResponse.json();
      setAgents(agentsData.agents || {});
      setSpawnLoading(false);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to spawn agent");
      setSpawnLoading(false);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete agent");

      // Refresh agents
      const agentsResponse = await fetch("/api/agents");
      const agentsData = await agentsResponse.json();
      setAgents(agentsData.agents || {});
      setSelectedAgentId(null);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete agent");
    }
  };

  // Filter tasks based on selected agent
  const getDisplayTasks = () => {
    if (viewMode === "global" || !selectedAgentId) return data.tasks;
    return data.tasks.filter((t) => t.agentId === selectedAgentId);
  };

  const displayTasks = getDisplayTasks();

  // Calculate stats
  const stats = {
    completed: displayTasks.filter((t) => t.status === "done").length,
    inProgress: displayTasks.filter((t) => t.status === "in-progress").length,
    queued: displayTasks.filter((t) => t.status === "queued").length,
    blocked: displayTasks.filter((t) => t.status === "blocked").length,
  };

  // Get active task (first in-progress)
  const activeTask = displayTasks.find((t) => t.status === "in-progress") || null;

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[2560px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-3xl font-bold text-slate-100">
                Alex Command Center
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Multi-Agent Task Management & Progress Tracking
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
              <div className="text-xs mt-1">
                {Object.keys(agents).length} agent{Object.keys(agents).length !== 1 ? "s" : ""} active
              </div>
            </div>
          </div>

          {/* Multi-Agent View Controls */}
          {Object.keys(agents).length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-700/30">
              <MultiAgentView
                agents={agents}
                tasks={displayTasks}
                selectedAgentId={selectedAgentId || undefined}
                onSelectAgent={(id) => {
                  setSelectedAgentId(id);
                  setViewMode("agent");
                }}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
          )}
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-6 py-3">
          Error: {error}
        </div>
      )}

      {/* Main Content - Four Column Layout with Agents */}
      <div className="max-w-[2560px] mx-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-[600px] text-slate-400">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-400px)]">
            {/* Left: Agent List */}
            <div className="lg:col-span-1 overflow-hidden">
              <AgentList
                agents={agents}
                selectedAgentId={selectedAgentId || undefined}
                onSelectAgent={setSelectedAgentId}
                onRefresh={() => {
                  // Trigger a manual refresh
                  fetch("/api/agents")
                    .then((res) => res.json())
                    .then((data) => setAgents(data.agents || {}));
                }}
                onDelete={handleDeleteAgent}
                onSpawnNew={() => setShowSpawnDialog(true)}
                isLoading={loading}
              />
            </div>

            {/* Left-Center: Task Queue */}
            <div className="lg:col-span-1 overflow-hidden">
              <TaskQueue
                tasks={displayTasks}
                onCreateTask={(task) =>
                  handleCreateTask({
                    ...task,
                    agentId: selectedAgentId || undefined,
                  })
                }
                onStatusChange={handleStatusChange}
                onDeleteTask={handleDeleteTask}
              />
            </div>

            {/* Right-Center: Active Work + Activity Log */}
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
                tasks={displayTasks}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* Spawn Agent Dialog */}
      <SpawnAgentDialog
        isOpen={showSpawnDialog}
        onClose={() => setShowSpawnDialog(false)}
        onSpawn={handleSpawnAgent}
        isLoading={spawnLoading}
      />
    </main>
  );
}
