"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface SpawnAgentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSpawn: (data: { label: string; taskDescription: string }) => Promise<void>;
  isLoading?: boolean;
}

export default function SpawnAgentDialog({
  isOpen,
  onClose,
  onSpawn,
  isLoading,
}: SpawnAgentDialogProps) {
  const [formData, setFormData] = useState({
    label: "",
    taskDescription: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.taskDescription.trim()) {
      setError("Task description is required");
      return;
    }

    try {
      await onSpawn({
        label: formData.label || "",
        taskDescription: formData.taskDescription,
      });
      setFormData({ label: "", taskDescription: "" });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to spawn agent");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700/50 rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <h2 className="text-lg font-semibold text-slate-100">Spawn New Agent</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-slate-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700/50 text-red-300 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Agent Label (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Data Processor, API Monitor..."
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              Auto-generated if left empty
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Task Description *
            </label>
            <textarea
              placeholder="What should this agent do?"
              value={formData.taskDescription}
              onChange={(e) =>
                setFormData({ ...formData, taskDescription: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Spawning..." : "Spawn Agent"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/50 text-xs text-slate-500">
          <p>
            The agent will be created and added to the active agents list. You can
            assign tasks and track progress from the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
