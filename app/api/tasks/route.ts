import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const TASKS_FILE = path.join(
  process.cwd(),
  "..",
  "dashboard",
  "tasks.json"
);

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "queued" | "in-progress" | "done" | "blocked";
  deadline?: string;
  createdAt: string;
  completedAt?: string | null;
  agentId?: string; // Optional agent association
}

interface TasksData {
  tasks: Task[];
  agents?: Record<string, any>; // Agent task collections
  activityLog: any[];
}

async function readTasks(): Promise<TasksData> {
  try {
    const data = await fs.readFile(TASKS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { tasks: [], agents: {}, activityLog: [] };
  }
}

async function writeTasks(data: TasksData): Promise<void> {
  await fs.writeFile(TASKS_FILE, JSON.stringify(data, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const data = await readTasks();
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get("agentId");

    // If filtering by agent, return only that agent's tasks
    if (agentId) {
      const agentTasks = data.tasks.filter((t) => t.agentId === agentId);
      return NextResponse.json({
        tasks: agentTasks,
        activityLog: data.activityLog,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await readTasks();

    const newTask: Task = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description || "",
      priority: body.priority || "low",
      status: "queued",
      deadline: body.deadline,
      createdAt: new Date().toISOString(),
      completedAt: null,
      agentId: body.agentId, // Associate with agent if provided
    };

    data.tasks.push(newTask);

    // Initialize agents object if not present
    if (!data.agents) {
      data.agents = {};
    }

    // Add to agent-specific tracking if agentId provided
    if (body.agentId) {
      if (!data.agents[body.agentId]) {
        data.agents[body.agentId] = { tasks: [] };
      }
      data.agents[body.agentId].tasks.push(newTask.id);
    }

    // Add activity log entry
    data.activityLog.push({
      id: `log-${Date.now()}`,
      action: "Task created",
      taskId: newTask.id,
      agentId: body.agentId,
      timestamp: new Date().toISOString(),
      details: newTask.title,
    });

    await writeTasks(data);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
