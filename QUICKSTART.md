# Alex Command Center - Quick Start

## 🚀 Get Running in 2 Minutes

### 1. Install Dependencies
```bash
cd alex-dashboard
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Visit: **http://localhost:3000**

## 📝 What You Can Do

- ✅ Create tasks with title, description, priority, deadline
- ✅ Change task status: Queued → In Progress → Done → Blocked
- ✅ Delete tasks
- ✅ View active task (current work)
- ✅ See real-time stats (completed, in-progress, queued, blocked)
- ✅ Activity log shows last 20 actions
- ✅ Auto-updates every 5 seconds

## 🗂️ Project Structure

| Directory | Purpose |
|-----------|---------|
| `/app` | Pages, layouts, API routes |
| `/app/api/tasks` | CRUD endpoints |
| `/components` | UI components (TaskCard, TaskQueue, etc.) |
| `../dashboard/tasks.json` | Data storage (workspace-level) |

## 🛠️ Available Scripts

```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Build for production
npm start          # Run production server
npm run lint       # Run ESLint
```

## 📊 Data Structure

**Task Object:**
```json
{
  "id": "1234567890",
  "title": "Build Dashboard",
  "description": "Create responsive layout",
  "priority": "high",
  "status": "in-progress",
  "deadline": "2026-02-15",
  "createdAt": "2026-02-10T10:00:00Z",
  "completedAt": null
}
```

**Activity Log Entry:**
```json
{
  "id": "log-1234",
  "action": "Task created",
  "taskId": "1234567890",
  "timestamp": "2026-02-10T10:00:00Z",
  "details": "Build Dashboard"
}
```

## 🔗 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/tasks` | Fetch all tasks & activity log |
| `POST` | `/api/tasks` | Create new task |
| `PATCH` | `/api/tasks/[id]` | Update task |
| `DELETE` | `/api/tasks/[id]` | Delete task |

## 📱 Three-Column Layout

```
┌─────────────────────────────────────────┐
│ Alex Command Center Header              │
├──────────────┬──────────────┬───────────┤
│              │              │           │
│ Task Queue   │ Active Work  │ Completed │
│              │              │ Tasks     │
│ • Queued     │ • Current    │           │
│   tasks      │   task card  │ • Done    │
│              │              │   tasks   │
│ [+ New Task] │ • Stats      │           │
│              │ • Activity   │ [Reopen]  │
│              │   log        │           │
│              │              │           │
└──────────────┴──────────────┴───────────┘
```

## 🎨 Styling

- **Framework**: Tailwind CSS
- **Theme**: Dark (slate-950 base)
- **Colors**: Blue, green, yellow, red for priorities/status
- **Responsive**: Mobile-first, adapts to screens

## 🚢 Deploy to Vercel

1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Go to vercel.com and import your GitHub repo
3. Click "Deploy" - done! 🎉

See `README_DEPLOYMENT.md` for detailed instructions.

## 🐛 Troubleshooting

**Port 3000 in use?**
```bash
npm run dev -- -p 3001
```

**Tasks not saving?**
- Check that `workspace/dashboard/tasks.json` exists
- Ensure file is readable/writable

**Build fails?**
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📚 Tech Stack

- **Next.js 14** - React framework (App Router)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library (prepared)
- **Lucide Icons** - Beautiful icons

## 💡 Tips

1. **Priority Levels**: Low (blue) → Medium (yellow) → High (red)
2. **Status Flow**: Queued → In Progress → Done (automatic timestamp)
3. **Auto-refresh**: Page updates every 5s from `/api/tasks`
4. **Activity Log**: Shows last 20 actions, updates in real-time
5. **Completed Tasks**: Hover to see "Reopen" button

---

**Next**: Read `README_DEPLOYMENT.md` for production deployment steps!
