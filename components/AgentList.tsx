"use client";

import React from "react";
import { RefreshCw, Plus, Trash2 } from "lucide-react";

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

interface AgentListProps {
  agents: Record<string, AgentMetadata>;
  selectedAgentId?: string;
  onSelectAgent?: (agentId: string) => void;
  onRefresh?: () => void;
  onDelete?: (agentId: string) => void;
  onSpawnNew?: () => void;
  isLoading?: boolean;
}

export default function AgentList({
  agents,
  selectedAgentId,
  onSelectAgent,
  onRefresh,
  onDelete,
  onSpawnNew,
  isLoading,
}: AgentListProps) {
  const agentList = Object.values(agents);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-900/30 border-green-700/50 text-green-300";
      case "completed":
        return "bg-blue-900/30 border-blue-700/50 text-blue-300";
      case "error":
        return "bg-red-900/30 border-red-700/50 text-red-300";
      case "idle":
      default:
        return "bg-slate-700/30 border-slate-600/50 text-slate-300";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "🟢";
      case "completed":
        return "✅";
      case "error":
        return "❌";
      case "idle":
      default:
        return "⚪";
    }
  };

  const getFormatTime = (isoTime: string) => {
    const date = new Date(isoTime);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);

    if (diffSecs < 60) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-slate-100">Active Agents</h2>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-slate-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={onSpawnNew}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            New Agent
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        {agentList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500">
            <p className="text-sm mb-2">No agents running</p>
            <p className="text-xs">Spawn one to get started!</p>
          </div>
        ) : (
          agentList.map((agent) => (
            <div
              key={agent.id}
              onClick={() => onSelectAgent?.(agent.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedAgentId === agent.id
                  ? "bg-slate-800/80 border-blue-500/50 ring-1 ring-blue-500/30"
                  : "border-slate-700/50 hover:border-slate-600/50 bg-slate-800/30"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{getStatusBadge(agent.status)}</span>
                    <h3 className="text-sm font-semibold text-slate-100 truncate">
                      {agent.label}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </div>
                  
                  {agent.currentTask && (
                    <p className="text-xs text-slate-400 truncate mb-2">
                      Current: {agent.currentTask}
                    </p>
                  )}

                  <div className="flex gap-3 text-xs text-slate-500">
                    <span>Tasks: {agent.taskCount}</span>
                    <span>Done: {agent.completedCount}</span>
                    <span>Active: {getFormatTime(agent.lastActivityTime)}</span>
                  </div>
                </div>

                {selectedAgentId === agent.id && onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete agent ${agent.label}?`)) {
                        onDelete(agent.id);
                      }
                    }}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {agentList.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-700/50 text-xs text-slate-500">
          <div className="grid grid-cols-2 gap-2">
            <div>Total Agents: {agentList.length}</div>
            <div>
              Active: {agentList.filter((a) => a.status === "active").length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
