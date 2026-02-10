-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'low',
  status TEXT CHECK (status IN ('queued', 'in-progress', 'done', 'blocked')) DEFAULT 'queued',
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  agent_id TEXT
);

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  status TEXT CHECK (status IN ('idle', 'active', 'completed', 'error')) DEFAULT 'idle',
  spawned_time TIMESTAMPTZ DEFAULT NOW(),
  last_activity_time TIMESTAMPTZ DEFAULT NOW(),
  current_task TEXT,
  task_count INTEGER DEFAULT 0,
  completed_count INTEGER DEFAULT 0
);

-- Create activity_log table
CREATE TABLE IF NOT EXISTS activity_log (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  task_id TEXT,
  agent_id TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  details TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_agent_id ON tasks(agent_id);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_activity_log_timestamp ON activity_log(timestamp DESC);
