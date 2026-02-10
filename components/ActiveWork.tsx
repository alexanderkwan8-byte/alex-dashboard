"use client";

import React from "react";
import { PlayCircle, CheckCircle2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "queued" | "in-progress" | "done" | "blocked";
  deadline?: string;
}

interface ActiveWorkProps {
  task: Task | null;
  stats: {
    completed: number;
    inProgress: number;
    queued: number;
    blocked: number;
  };
  onStatusChange: (id: string, status: string) => void;
}

const priorityColors = {
  low: "bg-blue-900/30 text-blue-300",
  medium: "bg-yellow-900/30 text-yellow-300",
  high: "bg-red-900/30 text-red-300",
};

export default function ActiveWork({
  task,
  stats,
  onStatusChange,
}: ActiveWorkProps) {
  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Current Task */}
      <div className="flex-1 flex flex-col">
        <h2 className="text-lg font-semibold text-slate-100 mb-3">
          Active Now
        </h2>

        {task ? (
          <div className="flex-1 flex flex-col p-4 bg-gradient-to-br from-blue-900/30 to-blue-900/10 border border-blue-700/50 rounded-lg">
            <div className="flex items-start gap-3 mb-3">
              <PlayCircle className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-slate-100 leading-snug">
                  {task.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-4 flex-1">
              {task.description}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priority]}`}
              >
                {task.priority.charAt(0).toUpperCase() +
                  task.priority.slice(1)}{" "}
                Priority
              </span>
            </div>

            {task.deadline && (
              <div className="text-xs text-slate-400 mb-4">
                Deadline: {new Date(task.deadline).toLocaleDateString()}
              </div>
            )}

            <button
              onClick={() => onStatusChange(task.id, "done")}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              Mark Complete
            </button>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4 bg-slate-800/30 border border-dashed border-slate-700/50 rounded-lg">
            <p className="text-slate-500 text-center">
              No active task. Queue is clear! 🚀
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <StatCard label="Completed" value={stats.completed} color="text-green-400" />
        <StatCard label="In Progress" value={stats.inProgress} color="text-blue-400" />
        <StatCard label="Queued" value={stats.queued} color="text-yellow-400" />
        <StatCard label="Blocked" value={stats.blocked} color="text-red-400" />
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
}

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-center">
      <div className={`text-lg font-bold ${color}`}>{value}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  );
}
