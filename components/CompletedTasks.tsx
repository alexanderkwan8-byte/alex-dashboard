"use client";

import React from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "queued" | "in-progress" | "done" | "blocked";
  deadline?: string;
  completedAt?: string | null;
}

interface CompletedTasksProps {
  tasks: Task[];
  onStatusChange: (id: string, status: string) => void;
}

export default function CompletedTasks({
  tasks,
  onStatusChange,
}: CompletedTasksProps) {
  const completedTasks = tasks.filter((t) => t.status === "done");

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">
        Completed Tasks
      </h2>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        {completedTasks.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No completed tasks</p>
        ) : (
          completedTasks.map((task) => (
            <div
              key={task.id}
              className="p-3 bg-slate-800/50 border border-green-700/30 rounded-lg group hover:border-green-600/50 transition-colors"
            >
              <div className="flex items-start gap-2">
                <CheckCircle2 className="text-green-400 flex-shrink-0 mt-0.5" size={16} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-slate-300 line-through">
                    {task.title}
                  </h4>
                  {task.completedAt && (
                    <p className="text-xs text-slate-500 mt-1">
                      Completed{" "}
                      {formatDate(new Date(task.completedAt))}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onStatusChange(task.id, "queued")}
                  className="p-1 opacity-0 group-hover:opacity-100 hover:bg-slate-700/50 rounded transition-all text-slate-400 hover:text-slate-200"
                  title="Reopen task"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString();
}
