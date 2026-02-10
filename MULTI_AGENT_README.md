# Multi-Agent Tracking System

## Overview

The Alex Command Center now includes comprehensive **multi-agent tracking** capabilities. This allows you to:

- **Spawn and manage multiple agents** simultaneously
- **Track agent status and activity** in real-time (updated every 5-10 seconds)
- **Organize tasks by agent** with per-agent task queues
- **Switch between global and agent-specific views**
- **Monitor agent performance** with completion statistics
- **Delete agents** and clean up completed work

## Features

### 1. Agent List Component

Located on the left sidebar, the Agent List displays all active agents with:

- **Agent Status** - Visual indicator (🟢 active, ⚪ idle, ✅ completed, ❌ error)
- **Agent Label** - Custom name or auto-generated identifier
- **Task Count** - Number of tasks assigned to the agent
- **Completion Stats** - Number of completed tasks
- **Last Activity** - When the agent last updated (relative time)
- **Current Task** - Brief description of what the agent is working on

**Actions:**
- Click an agent to select it and filter tasks to that agent
- Click the refresh button to manually sync agent data
- Click "New Agent" to spawn a new agent
- Click the trash icon on selected agent to delete it

### 2. Spawn New Agent

Click the **"New Agent"** button in the Agent List to open the spawn dialog.

**Form Fields:**
- **Agent Label** (optional) - Friendly name for the agent (e.g., "Data Processor", "API Monitor")
- **Task Description** (required) - What should this agent do?

Once spawned, the agent appears in the list with `idle` status and is ready to receive tasks.

### 3. Multi-Agent View Controls

At the top of the dashboard, the **Multi-Agent View** section provides:

- **View Mode Toggle:**
  - **Global View** - See all tasks across all agents
  - **Agent View** - See tasks for a specific agent
  
- **Agent Tabs** - Quick switcher showing all agents with:
  - Agent name and status indicator
  - Active task count badge
  - Click to select and filter

- **Real-Time Stats:**
  - Total tasks across selection
  - Queued tasks
  - Active (in-progress) tasks
  - Completed tasks
  - Blocked tasks

### 4. Task Management per Agent

When an agent is selected:

- **Task Queue** shows only that agent's queued tasks
- **Active Work** displays the agent's current task
- **Completed Tasks** shows what the agent has finished
- **Activity Log** shows that agent's recent actions

Create new tasks directly from the dashboard - they'll be assigned to the selected agent.

## Data Structure

### Tasks (Updated)

Tasks now include an optional `agentId` field:

```json
{
  "id": "1707584400000",
  "title": "Process Data",
  "description": "Parse and validate incoming dataset",
  "priority": "high",
  "status": "in-progress",
  "agentId": "agent-1707584400000",
  "createdAt": "2026-02-10T16:00:00.000Z",
  "completedAt": null
}
```

### Agents

New agents.json file stores agent metadata:

```json
{
  "agents": {
    "agent-1707584400000": {
      "id": "agent-1707584400000",
      "label": "Data Processor",
      "status": "active",
      "spawnedTime": "2026-02-10T15:50:00.000Z",
      "lastActivityTime": "2026-02-10T16:14:00.000Z",
      "currentTask": "Process Data",
      "taskCount": 5,
      "completedCount": 2
    }
  },
  "lastUpdated": "2026-02-10T16:14:00.000Z"
}
```

## API Endpoints

### Agents API

#### GET /api/agents
Fetch all active agents.

**Response:**
```json
{
  "agents": {
    "agent-id": {
      "id": "agent-id",
      "label": "Agent Name",
      "status": "active",
      ...
    }
  },
  "lastUpdated": "2026-02-10T16:14:00.000Z"
}
```

#### POST /api/agents
Spawn a new agent.

**Request:**
```json
{
  "label": "Optional Agent Name",
  "taskDescription": "What the agent should do"
}
```

**Response:** Returns the created agent metadata (201 Created)

#### PATCH /api/agents/:id
Update agent status and metadata.

**Request:**
```json
{
  "status": "active",
  "label": "Updated Name",
  "currentTask": "Current task description",
  "taskCount": 5,
  "completedCount": 2
}
```

#### DELETE /api/agents/:id
Remove an agent and stop tracking it.

**Response:** `{ "success": true }`

### Tasks API (Enhanced)

#### GET /api/tasks?agentId=agent-id
Fetch tasks with optional agent filtering.

**Query Parameters:**
- `agentId` (optional) - Filter tasks by specific agent

#### POST /api/tasks
Create a new task (optionally for a specific agent).

**Request:**
```json
{
  "title": "Task Title",
  "description": "Task description",
  "priority": "medium",
  "deadline": "2026-02-15",
  "agentId": "agent-1707584400000"
}
```

## UI Layout

### Full 4-Column Dashboard

```
┌─ AGENTS ─┬─ TASK QUEUE ─┬─ ACTIVE WORK ─┬─ COMPLETED ─┐
│           │              │   + ACTIVITY  │             │
│ • Agent 1 │ • Queued 1   │               │ ✓ Task 1    │
│ • Agent 2 │ • Queued 2   │  Status Bar   │ ✓ Task 2    │
│ • Agent 3 │ • Queued 3   │               │ ✓ Task 3    │
│           │              │               │             │
└───────────┴──────────────┴───────────────┴─────────────┘
```

### Header Multi-Agent Controls

```
┌─────────────────────────────────────────────────────┐
│ Alex Command Center                    X agents     │
│ Multi-Agent Task Management                         │
├─────────────────────────────────────────────────────┤
│ View: [Global View] [Agent View]                    │
│ Agents: [All (3)] [Agent 1 (2)] [Agent 2 (1)] [...] │
│ Stats: Total: 5 | Queued: 2 | Active: 1 | Done: 2  │
└─────────────────────────────────────────────────────┘
```

## Backward Compatibility

The system maintains **full backward compatibility** with the original single-agent setup:

- Existing tasks without `agentId` are treated as global tasks
- Global view shows all tasks regardless of agent assignment
- You can mix agent-assigned and global tasks
- Single-agent workflows work exactly as before
- `agents` field in data is optional and auto-created

## Usage Patterns

### Pattern 1: Global Task Management
Use global view to see all work across all agents:
- Click "Global View" at the top
- Manage all tasks and agents from one dashboard
- Good for overview and coordination

### Pattern 2: Per-Agent Focus
Focus on one agent's workflow:
- Click an agent in the list
- Work on that agent's queue
- Switch agents as priorities change
- Good for deep focus work

### Pattern 3: Spawning Agents for Tasks
For parallel work:
1. Click "New Agent"
2. Give it a task description
3. Create tasks in the queue
4. Agent works while you move to next
5. Check status periodically with refresh

### Pattern 4: Agent Cleanup
Remove completed agents:
1. Select agent from list
2. Check completion stats
3. Click trash icon to delete
4. Agent data is archived in activity log

## Performance

The dashboard polls data every **5 seconds** to keep agent status fresh. This provides:

- Real-time agent status updates
- Current task tracking
- Activity history
- Responsive UI updates

For large numbers of agents (20+), consider:
- Using agent-filtered views instead of global view
- Checking specific agents instead of refreshing all
- Archiving/deleting old agents periodically

## Examples

### Create an Agent and Assign Tasks

```typescript
// Spawn agent
POST /api/agents
{
  "label": "Data Pipeline",
  "taskDescription": "Process and validate incoming data"
}

// Response: agent-1707584400000

// Create task for agent
POST /api/tasks
{
  "title": "Parse Dataset A",
  "agentId": "agent-1707584400000",
  "priority": "high"
}
```

### Check Agent Status

```typescript
// Get all agents
GET /api/agents

// Response shows each agent's status, task count, etc.
// Check "lastActivityTime" to see when agent was last active
```

### Switch to Global View

```typescript
// Get all tasks (no filtering)
GET /api/tasks

// Returns all tasks across all agents
```

## Troubleshooting

### Agent Not Showing Up
- Refresh the page (agents load every 5s)
- Click the refresh button in Agent List
- Check browser console for errors

### Tasks Not Appearing for Agent
- Verify agent is selected (should be highlighted)
- Check view mode is not in global
- Reload page to sync data

### Agent Status Not Updating
- Ensure dashboard is still polling (should see "Last updated" change)
- Check /api/agents endpoint manually
- Verify agents.json file exists in dashboard directory

## File Structure

```
alex-dashboard/
├── app/
│   ├── api/
│   │   ├── agents/
│   │   │   ├── route.ts          (GET/POST agents)
│   │   │   └── [id]/route.ts     (PATCH/DELETE agent)
│   │   └── tasks/
│   │       ├── route.ts          (GET/POST tasks, now with agentId support)
│   │       └── [id]/route.ts     (PATCH/DELETE task)
│   ├── page.tsx                  (Main dashboard with multi-agent support)
│   └── layout.tsx
├── components/
│   ├── AgentList.tsx             (NEW: Agent list sidebar)
│   ├── SpawnAgentDialog.tsx       (NEW: Spawn new agent modal)
│   ├── MultiAgentView.tsx         (NEW: View mode controls and tabs)
│   ├── TaskQueue.tsx             (Updated for agent filtering)
│   ├── ActiveWork.tsx
│   ├── CompletedTasks.tsx
│   ├── ActivityLog.tsx
│   └── TaskCard.tsx
└── ...
```

## Next Steps

Potential enhancements:

- [ ] Agent scheduling/auto-spawn based on time
- [ ] Agent performance metrics (speed, accuracy)
- [ ] Task assignment suggestions by agent capability
- [ ] Integration with OpenClaw sessions_list API
- [ ] Agent communication/coordination UI
- [ ] Export agent performance reports
- [ ] Agent groups/teams
- [ ] Advanced filtering (by priority, deadline, status)
