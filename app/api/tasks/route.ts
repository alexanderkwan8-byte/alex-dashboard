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
}

interface TasksData {
  tasks: Task[];
  activityLog: any[];
}

async function readTasks(): Promise<TasksData> {
  try {
    const data = await fs.readFile(TASKS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { tasks: [], activityLog: [] };
  }
}

async function writeTasks(data: TasksData): Promise<void> {
  await fs.writeFile(TASKS_FILE, JSON.stringify(data, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const data = await readTasks();
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
    };

    data.tasks.push(newTask);

    // Add activity log entry
    data.activityLog.push({
      id: `log-${Date.now()}`,
      action: "Task created",
      taskId: newTask.id,
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
