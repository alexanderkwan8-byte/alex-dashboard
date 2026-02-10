import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: agents, error } = await supabase
      .from("agents")
      .select("*")
      .order("spawned_time", { ascending: false });

    if (error) throw error;

    // Convert array to object keyed by id
    const agentsObj = (agents || []).reduce((acc: any, agent: any) => {
      acc[agent.id] = agent;
      return acc;
    }, {});

    return NextResponse.json({
      agents: agentsObj,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newAgent = {
      id: `agent-${Date.now()}`,
      label: body.label || `Agent ${Date.now()}`,
      status: "active",
      spawned_time: new Date().toISOString(),
      last_activity_time: new Date().toISOString(),
      current_task: body.taskDescription || null,
      task_count: 0,
      completed_count: 0,
    };

    const { data: agent, error } = await supabase
      .from("agents")
      .insert([newAgent])
      .select()
      .single();

    if (error) throw error;

    // Log agent spawn
    const logEntry = {
      id: `log-${Date.now()}`,
      action: "Agent spawned",
      agent_id: newAgent.id,
      timestamp: new Date().toISOString(),
      details: body.label || "New agent",
    };

    await supabase.from("activity_log").insert([logEntry]);

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json(
      { error: "Failed to create agent" },
      { status: 500 }
    );
  }
}
