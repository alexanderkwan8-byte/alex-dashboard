"use client";

import React, { useState } from "react";
import TaskCard from "./TaskCard";
import { Plus } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "queued" | "in-progress" | "done" | "blocked";
  deadline?: string;
}

interface TaskQueueProps {
  tasks: Task[];
  onCreateTask: (task: Omit<Task, "id">) => void;
  onStatusChange: (id: string, status: string) => void;
  onDeleteTask: (id: string) => void;
  priorityFilter?: string;
}

export default function TaskQueue({
  tasks,
  onCreateTask,
  onStatusChange,
  onDeleteTask,
  priorityFilter,
}: TaskQueueProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    deadline: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onCreateTask({
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      status: "queued",
      deadline: formData.deadline || undefined,
    });

    setFormData({ title: "", description: "", priority: "medium", deadline: "" });
    setShowForm(false);
  };

  const queuedTasks = tasks.filter(
    (t) =>
      t.status === "queued" &&
      (!priorityFilter || t.priority === priorityFilter)
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-slate-100">Task Queue</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg space-y-3"
        >
          <input
            type="text"
            placeholder="Task title..."
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            required
          />
          <textarea
            placeholder="Description (optional)..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as any,
                })
              }
              className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-700 rounded text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-700 rounded text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
            >
              Create Task
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        {queuedTasks.length === 0 ? (
          <p className="text-slate-500 text-center py-8">
            No queued tasks. Great work! 🎉
          </p>
        ) : (
          queuedTasks.map((task) => (
            <TaskCard
              key={task.id}
              {...task}
              onStatusChange={onStatusChange}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
