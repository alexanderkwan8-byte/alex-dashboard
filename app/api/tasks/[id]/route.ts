import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Fetch current task for comparison
    const { data: currentTask } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();

    if (!currentTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updates: any = { ...body };

    // If status changed to done, set completed_at
    if (body.status === "done" && currentTask.status !== "done") {
      updates.completed_at = new Date().toISOString();
    }

    const { data: task, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Log status change if applicable
    if (body.status && body.status !== currentTask.status) {
      const logEntry = {
        id: `log-${Date.now()}`,
        action: "Status changed",
        task_id: id,
        timestamp: new Date().toISOString(),
        details: `${currentTask.status} → ${body.status}`,
      };

      await supabase.from("activity_log").insert([logEntry]);
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) throw error;

    // Log deletion
    const logEntry = {
      id: `log-${Date.now()}`,
      action: "Task deleted",
      task_id: id,
      timestamp: new Date().toISOString(),
      details: "Task removed",
    };

    await supabase.from("activity_log").insert([logEntry]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
