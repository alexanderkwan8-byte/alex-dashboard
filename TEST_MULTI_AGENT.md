# Multi-Agent Tracking - Testing Guide

## Setup

Before testing, ensure the following files/directories exist:

```bash
cd alex-dashboard
npm install
npm run dev
```

The dashboard will be available at `http://localhost:3000`

## Manual Testing Checklist

### 1. **API Endpoints**

Test each endpoint using curl or Postman:

#### Create an Agent
```bash
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Data Pipeline",
    "taskDescription": "Process incoming data"
  }'
```

Expected Response: 201 Created with agent metadata

#### Fetch All Agents
```bash
curl http://localhost:3000/api/agents
```

Expected Response: All agents with their metadata

#### Update Agent
```bash
curl -X PATCH http://localhost:3000/api/agents/agent-1707584400000 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active",
    "taskCount": 5
  }'
```

Expected Response: Updated agent metadata

#### Delete Agent
```bash
curl -X DELETE http://localhost:3000/api/agents/agent-1707584400000
```

Expected Response: `{ "success": true }`

#### Create Task for Agent
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Process Data",
    "description": "Parse and validate dataset",
    "priority": "high",
    "agentId": "agent-1707584400000"
  }'
```

Expected Response: 201 Created with task data

#### Get Tasks for Specific Agent
```bash
curl "http://localhost:3000/api/tasks?agentId=agent-1707584400000"
```

Expected Response: Only tasks with matching agentId

### 2. **UI Component Testing**

#### Agent List Component
- [ ] Agent list appears on left sidebar
- [ ] Shows agent names, status, and task counts
- [ ] "New Agent" button works and opens dialog
- [ ] Clicking agent highlights it and selects it
- [ ] Trash icon appears on selected agent
- [ ] Refresh button works (icon animates)
- [ ] Empty state shows "No agents running"

#### Spawn Agent Dialog
- [ ] Modal appears when "New Agent" is clicked
- [ ] Can type agent label (optional)
- [ ] Can type task description (required)
- [ ] Submit button creates agent and closes dialog
- [ ] Cancel button closes without creating
- [ ] Error message shows if task description empty
- [ ] Loading state shows while submitting

#### MultiAgentView
- [ ] View mode toggle shows "Global View" and "Agent View"
- [ ] Agent tabs show all agents with status indicator
- [ ] Active task count badge shows on tab
- [ ] Stats display updates based on selected view
- [ ] Clicking "All" shows global stats
- [ ] Clicking agent tab switches to that agent's view

#### Task Management
- [ ] Tasks created in global view don't have agentId
- [ ] Tasks created when agent selected have agentId
- [ ] Task queue filters show correct tasks per agent
- [ ] Can change task status (queued → in-progress → done)
- [ ] Status changes update activity log
- [ ] Completed tasks appear in right column

### 3. **Data Persistence Testing**

#### tasks.json Structure
Check file at `../dashboard/tasks.json`:
```json
{
  "tasks": [
    {
      "id": "...",
      "title": "...",
      "agentId": "agent-...",
      ...
    }
  ],
  "agents": {
    "agent-...": {
      "tasks": ["task-id-1", "task-id-2"]
    }
  },
  "activityLog": [...]
}
```

#### agents.json Structure
Check file at `../dashboard/agents.json`:
```json
{
  "agents": {
    "agent-1707584400000": {
      "id": "agent-1707584400000",
      "label": "Data Pipeline",
      "status": "idle",
      "spawnedTime": "...",
      "lastActivityTime": "...",
      "currentTask": "Process incoming data",
      "taskCount": 0,
      "completedCount": 0
    }
  },
  "lastUpdated": "..."
}
```

### 4. **Real-Time Updates**

- [ ] Dashboard polls every 5 seconds
- [ ] "Last updated" timestamp changes
- [ ] Agent status updates appear without page refresh
- [ ] Task count changes appear in agent list
- [ ] New agents appear in list automatically
- [ ] Deleted agents disappear from list

### 5. **Integration Testing**

#### Workflow 1: Global + Single Agent
1. Open dashboard in global view
2. Create task (should be unassigned)
3. Spawn new agent
4. Select agent in list
5. Create task (should be assigned)
6. Change task status → in-progress
7. See task appear in Active Work
8. Change to done → appears in Completed
9. Check agent task count increased

#### Workflow 2: Multi-Agent Parallel Work
1. Spawn 3 agents with different labels
2. Create 5 tasks total
3. Assign 2 to Agent 1, 2 to Agent 2, 1 to Agent 3
4. Select Agent 1 → see only their tasks
5. Select Agent 2 → see only their tasks  
6. Click "Global View" → see all 5 tasks
7. Update stats for each agent
8. Delete Agent 1 → disappears from list

#### Workflow 3: Backward Compatibility
1. Create global task (no agent)
2. Spawn agent
3. Switch to that agent → global task should NOT appear
4. Switch to Global View → global task appears
5. Create task for agent while in global view
   - Should still create if task has agentId

### 6. **Error Handling**

- [ ] Network error shows gracefully
- [ ] Invalid form data shows validation error
- [ ] API errors display in error banner
- [ ] Refresh recovers from error state
- [ ] Concurrent updates don't cause issues

### 7. **Performance**

- [ ] Dashboard with 5+ agents loads quickly
- [ ] Polling doesn't cause lag/flicker
- [ ] Task creation is responsive
- [ ] Agent selection switches instantly
- [ ] No console errors or warnings

## Expected File Changes

After running tests, these files should be created:

```
workspace/
└── dashboard/
    ├── tasks.json    (updated with agentId support)
    └── agents.json   (new, contains all agent metadata)
```

## Test Results Summary

Create a checklist like:

```markdown
## Multi-Agent Testing Results

Date: 2026-02-10
Tester: [Your Name]

### API Tests
- [x] POST /api/agents - Creates agent
- [x] GET /api/agents - Lists agents
- [x] PATCH /api/agents/:id - Updates agent
- [x] DELETE /api/agents/:id - Deletes agent
- [x] GET /api/tasks?agentId=X - Filters tasks
- [x] POST /api/tasks with agentId - Creates agent task

### UI Components
- [x] AgentList renders and functions
- [x] SpawnAgentDialog opens/closes
- [x] MultiAgentView tabs work
- [x] Task filtering by agent works
- [x] Global view shows all tasks

### Integration
- [x] Workflow 1: Global + Single Agent - PASS
- [x] Workflow 2: Multi-Agent Parallel - PASS
- [x] Workflow 3: Backward Compatibility - PASS

### Issues Found
(None found - all tests passed)

### Notes
[Any additional observations]
```

## Troubleshooting

If tests fail, check:

1. **Dev server not running**
   - Run `npm run dev` in alex-dashboard directory
   - Check http://localhost:3000 loads

2. **Database files not created**
   - Ensure `../dashboard/` directory exists
   - Files are auto-created on first API call

3. **lucide-react not installed**
   - Run `npm install lucide-react`

4. **Tailwind styles not loading**
   - Check `globals.css` exists
   - Run `npm install` to get all dependencies

5. **Agent not appearing in list**
   - Check browser console for errors
   - Verify agents.json file created
   - Try clicking refresh button

6. **Tasks not filtering by agent**
   - Ensure agent selected (should be highlighted)
   - Check view mode is "Agent View"
   - Verify task has matching agentId

## Success Criteria

All of the following must pass for multi-agent system to be complete:

- ✅ Can spawn and list multiple agents
- ✅ Can create and assign tasks to agents
- ✅ Can switch between global and per-agent views
- ✅ Agent status updates in real-time
- ✅ Can delete agents
- ✅ Task management works per agent
- ✅ Backward compatibility maintained
- ✅ Data persists in JSON files
- ✅ UI is responsive and intuitive
- ✅ No console errors or warnings
