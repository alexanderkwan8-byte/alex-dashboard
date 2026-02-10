import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params;
    const body = await request.json();

    const updates: any = {
      ...body,
      last_activity_time: new Date().toISOString(),
    };

    const { data: agent, error } = await supabase
      .from("agents")
      .update(updates)
      .eq("id", agentId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Agent not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(agent);
  } catch (error) {
    console.error("Error updating agent:", error);
    return NextResponse.json(
      { error: "Failed to update agent" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params;

    const { error } = await supabase.from("agents").delete().eq("id", agentId);

    if (error) throw error;

    // Log agent deletion
    const logEntry = {
      id: `log-${Date.now()}`,
      action: "Agent removed",
      agent_id: agentId,
      timestamp: new Date().toISOString(),
      details: "Agent deleted",
    };

    await supabase.from("activity_log").insert([logEntry]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting agent:", error);
    return NextResponse.json(
      { error: "Failed to delete agent" },
      { status: 500 }
    );
  }
}
