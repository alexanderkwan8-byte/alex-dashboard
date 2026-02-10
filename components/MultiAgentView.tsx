"use client";

import React, { useState, useEffect } from "react";
import { LayoutGrid, List } from "lucide-react";

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

interface MultiAgentViewProps {
  agents: Record<string, AgentMetadata>;
  tasks: Task[];
  selectedAgentId?: string;
  onSelectAgent?: (agentId: string) => void;
  viewMode?: "agent" | "global";
  onViewModeChange?: (mode: "agent" | "global") => void;
}

export default function MultiAgentView({
  agents,
  tasks,
  selectedAgentId,
  onSelectAgent,
  viewMode = "global",
  onViewModeChange,
}: MultiAgentViewProps) {
  const agentList = Object.values(agents).sort(
    (a, b) =>
      new Date(b.lastActivityTime).getTime() -
      new Date(a.lastActivityTime).getTime()
  );

  const getTasksForAgent = (agentId: string) => {
    return tasks.filter((t) => t.agentId === agentId);
  };

  const getDisplayTasks = () => {
    if (viewMode === "global") return tasks;
    if (selectedAgentId) return getTasksForAgent(selectedAgentId);
    return [];
  };

  const displayTasks = getDisplayTasks();
  const stats = {
    total: displayTasks.length,
    queued: displayTasks.filter((t) => t.status === "queued").length,
    inProgress: displayTasks.filter((t) => t.status === "in-progress").length,
    done: displayTasks.filter((t) => t.status === "done").length,
    blocked: displayTasks.filter((t) => t.status === "blocked").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400";
      case "idle":
        return "text-slate-400";
      case "completed":
        return "text-blue-400";
      case "error":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-900/30 border-green-700/50";
      case "idle":
        return "bg-slate-700/30 border-slate-600/50";
      case "completed":
        return "bg-blue-900/30 border-blue-700/50";
      case "error":
        return "bg-red-900/30 border-red-700/50";
      default:
        return "bg-slate-700/30 border-slate-600/50";
    }
  };

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex items-center gap-2 p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg">
        <div className="flex-1">
          <p className="text-xs text-slate-400 mb-2">View Mode</p>
          <div className="flex gap-2">
            <button
              onClick={() => onViewModeChange?.("global")}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                viewMode === "global"
                  ? "bg-blue-600/80 text-white"
                  : "bg-slate-700/30 text-slate-300 hover:bg-slate-600/30"
              }`}
            >
              <LayoutGrid size={14} />
              Global View
            </button>
            <button
              onClick={() => onViewModeChange?.("agent")}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                viewMode === "agent"
                  ? "bg-blue-600/80 text-white"
                  : "bg-slate-700/30 text-slate-300 hover:bg-slate-600/30"
              }`}
            >
              <List size={14} />
              Agent View
            </button>
          </div>
        </div>
      </div>

      {/* Agent Tabs */}
      {agentList.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-400 px-1">Select Agent</p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
            {/* Global option */}
            <button
              onClick={() => onSelectAgent?.(null!)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                viewMode === "global" && !selectedAgentId
                  ? "bg-slate-700 border border-slate-600 text-slate-100"
                  : "bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-slate-300"
              }`}
            >
              All ({agentList.length})
            </button>

            {/* Agent tabs */}
            {agentList.map((agent) => {
              const agentTasks = getTasksForAgent(agent.id);
              const activeCount = agentTasks.filter(
                (t) => t.status === "in-progress"
              ).length;

              return (
                <button
                  key={agent.id}
                  onClick={() => onSelectAgent?.(agent.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-2 ${
                    selectedAgentId === agent.id
                      ? "bg-slate-700 border border-blue-500/50 text-slate-100"
                      : "bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-slate-300"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      agent.status === "active" ? "bg-green-400" : "bg-slate-500"
                    }`}
                  />
                  <span>{agent.label}</span>
                  {activeCount > 0 && (
                    <span className="bg-emerald-900/50 text-emerald-300 text-xs px-1.5 rounded">
                      {activeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-5 gap-2">
        <div className="p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg">
          <p className="text-xs text-slate-400">Total</p>
          <p className="text-lg font-bold text-slate-100">{stats.total}</p>
        </div>
        <div className="p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg">
          <p className="text-xs text-slate-400">Queued</p>
          <p className="text-lg font-bold text-yellow-400">{stats.queued}</p>
        </div>
        <div className="p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg">
          <p className="text-xs text-slate-400">Active</p>
          <p className="text-lg font-bold text-emerald-400">{stats.inProgress}</p>
        </div>
        <div className="p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg">
          <p className="text-xs text-slate-400">Done</p>
          <p className="text-lg font-bold text-blue-400">{stats.done}</p>
        </div>
        <div className="p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg">
          <p className="text-xs text-slate-400">Blocked</p>
          <p className="text-lg font-bold text-red-400">{stats.blocked}</p>
        </div>
      </div>
    </div>
  );
}
