import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "..", "dashboard", "agents.json");

interface AgentMetadata {
  id: string;
  label: string;
  status: "idle" | "active" | "completed" | "error";
  spawnedTime: string;
  lastActivityTime: string;
  currentTask?: string;
  taskCount: number;
  completedCount: number;
}

interface AgentsData {
  agents: Record<string, AgentMetadata>;
  lastUpdated: string;
}

async function readAgents(): Promise<AgentsData> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { agents: {}, lastUpdated: new Date().toISOString() };
  }
}

async function writeAgents(data: AgentsData): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id;
    const body = await request.json();
    const data = await readAgents();

    const agent = data.agents[agentId];
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Update agent properties
    if (body.status) agent.status = body.status;
    if (body.label) agent.label = body.label;
    if (body.currentTask !== undefined) agent.currentTask = body.currentTask;
    if (body.taskCount !== undefined) agent.taskCount = body.taskCount;
    if (body.completedCount !== undefined) agent.completedCount = body.completedCount;

    agent.lastActivityTime = new Date().toISOString();
    data.lastUpdated = new Date().toISOString();

    await writeAgents(data);
    return NextResponse.json(agent);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update agent" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id;
    const data = await readAgents();

    delete data.agents[agentId];
    data.lastUpdated = new Date().toISOString();

    await writeAgents(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete agent" },
      { status: 500 }
    );
  }
}
