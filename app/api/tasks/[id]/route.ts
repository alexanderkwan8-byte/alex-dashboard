import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const TASKS_FILE = path.join(
  process.cwd(),
  "..",
  "dashboard",
  "tasks.json"
);

interface TasksData {
  tasks: any[];
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await readTasks();

    const task = data.tasks.find((t) => t.id === id);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const oldStatus = task.status;

    // Update task
    Object.assign(task, body);

    if (body.status) {
      task.status = body.status;
      if (body.status === "done") {
        task.completedAt = new Date().toISOString();
      }

      // Log status change
      data.activityLog.push({
        id: `log-${Date.now()}`,
        action: "Status changed",
        taskId: id,
        timestamp: new Date().toISOString(),
        details: `${oldStatus} → ${body.status}`,
      });
    }

    await writeTasks(data);
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await readTasks();

    data.tasks = data.tasks.filter((t) => t.id !== id);

    data.activityLog.push({
      id: `log-${Date.now()}`,
      action: "Task deleted",
      taskId: id,
      timestamp: new Date().toISOString(),
      details: "Task removed",
    });

    await writeTasks(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
