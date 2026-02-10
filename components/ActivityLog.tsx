"use client";

import React from "react";
import { CheckCircle2, Clock, Plus, AlertCircle, Trash2 } from "lucide-react";

interface LogEntry {
  id: string;
  action: string;
  taskId: string;
  timestamp: string;
  details: string;
}

interface ActivityLogProps {
  entries: LogEntry[];
}

const actionIcons = {
  "Task created": Plus,
  "Status changed": Clock,
  "Task completed": CheckCircle2,
  "Task deleted": Trash2,
  default: Clock,
};

const actionColors = {
  "Task created": "text-blue-400 bg-blue-900/20",
  "Status changed": "text-yellow-400 bg-yellow-900/20",
  "Task completed": "text-green-400 bg-green-900/20",
  "Task deleted": "text-red-400 bg-red-900/20",
  default: "text-slate-400 bg-slate-900/20",
};

export default function ActivityLog({ entries }: ActivityLogProps) {
  const recentEntries = entries.slice(-20);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">
        Activity Log
      </h2>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        {recentEntries.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No activity yet</p>
        ) : (
          recentEntries.reverse().map((entry) => {
            const IconComponent =
              actionIcons[entry.action as keyof typeof actionIcons] ||
              actionIcons.default;
            const colorClass =
              actionColors[entry.action as keyof typeof actionColors] ||
              actionColors.default;

            return (
              <div
                key={entry.id}
                className="flex gap-3 p-3 bg-slate-800/50 border border-slate-700/30 rounded-lg hover:border-slate-600/50 transition-colors"
              >
                <div className={`flex-shrink-0 p-2 rounded ${colorClass}`}>
                  <IconComponent size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-300">
                    {entry.action}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{entry.details}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatTime(new Date(entry.timestamp))}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}
