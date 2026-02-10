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

export async function GET(request: NextRequest) {
  try {
    const data = await readAgents();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await readAgents();

    const agentId = `agent-${Date.now()}`;
    const newAgent: AgentMetadata = {
      id: agentId,
      label: body.label || `Agent ${Object.keys(data.agents).length + 1}`,
      status: "idle",
      spawnedTime: new Date().toISOString(),
      lastActivityTime: new Date().toISOString(),
      currentTask: body.taskDescription,
      taskCount: 0,
      completedCount: 0,
    };

    data.agents[agentId] = newAgent;
    data.lastUpdated = new Date().toISOString();

    await writeAgents(data);
    return NextResponse.json(newAgent, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create agent" },
      { status: 500 }
    );
  }
}
