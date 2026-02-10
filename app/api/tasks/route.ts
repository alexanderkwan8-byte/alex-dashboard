import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get("agentId");

    let query = supabase.from("tasks").select("*").order("created_at", { ascending: false });

    if (agentId) {
      query = query.eq("agent_id", agentId);
    }

    const { data: tasks, error: tasksError } = await query;

    if (tasksError) throw tasksError;

    const { data: activityLog, error: logError } = await supabase
      .from("activity_log")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(50);

    if (logError) throw logError;

    return NextResponse.json({
      tasks: tasks || [],
      activityLog: activityLog || [],
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newTask = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description || "",
      priority: body.priority || "low",
      status: "queued",
      deadline: body.deadline || null,
      created_at: new Date().toISOString(),
      completed_at: null,
      agent_id: body.agentId || null,
    };

    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .insert([newTask])
      .select()
      .single();

    if (taskError) throw taskError;

    // Add activity log entry
    const logEntry = {
      id: `log-${Date.now()}`,
      action: "Task created",
      task_id: newTask.id,
      agent_id: body.agentId || null,
      timestamp: new Date().toISOString(),
      details: newTask.title,
    };

    await supabase.from("activity_log").insert([logEntry]);

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
