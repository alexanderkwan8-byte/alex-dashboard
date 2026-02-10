"use client";

import React from "react";
import { ChevronRight, Trash2, Clock } from "lucide-react";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "queued" | "in-progress" | "done" | "blocked";
  deadline?: string;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: "bg-blue-900/30 border-blue-700/50 text-blue-300",
  medium: "bg-yellow-900/30 border-yellow-700/50 text-yellow-300",
  high: "bg-red-900/30 border-red-700/50 text-red-300",
};

const statusColors = {
  queued: "bg-slate-700/30",
  "in-progress": "bg-blue-700/30",
  done: "bg-green-700/30",
  blocked: "bg-red-700/30",
};

const statusLabels = {
  queued: "Queued",
  "in-progress": "In Progress",
  done: "Done",
  blocked: "Blocked",
};

const nextStatus = {
  queued: "in-progress",
  "in-progress": "done",
  done: "queued",
  blocked: "queued",
};

export default function TaskCard({
  id,
  title,
  description,
  priority,
  status,
  deadline,
  onStatusChange,
  onDelete,
}: TaskCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 backdrop-blur-sm transition-all hover:shadow-lg ${statusColors[status]} border-slate-700/50`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-snug text-slate-100">
            {title}
          </h3>
        </div>
        <button
          onClick={() => onDelete(id)}
          className="p-1 hover:bg-red-900/50 rounded transition-colors flex-shrink-0"
          title="Delete task"
        >
          <Trash2 size={16} className="text-red-400" />
        </button>
      </div>

      {description && (
        <p className="text-xs text-slate-400 mb-3 line-clamp-2">
          {description}
        </p>
      )}

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span
          className={`px-2 py-1 rounded text-xs font-medium border ${priorityColors[priority]}`}
        >
          {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
        </span>

        {deadline && (
          <div className="flex items-center gap-1 text-xs text-slate-300">
            <Clock size={14} />
            {new Date(deadline).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onStatusChange(id, nextStatus[status])}
          className="flex items-center gap-1 flex-1 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded text-xs font-medium text-slate-300 transition-colors"
        >
          <span>{statusLabels[status]}</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
