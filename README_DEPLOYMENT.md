# Alex Command Center - Deployment Guide

## Project Overview

A Next.js 14 dashboard for task management and progress tracking with real-time updates, built with TypeScript, Tailwind CSS, and a three-column responsive layout.

## Features

### MVP
- **Task Queue**: Create, manage, and filter tasks by status and priority
- **Progress Tracking**: Active work display, stats, and activity logging
- **Three-Column Layout**: Task queue (left), active work + activity log (center), completed tasks (right)
- **Real-time Updates**: Polls task data every 5 seconds
- **API Routes**: Full CRUD operations for task management

### Task Status Flow
- Queued → In Progress → Done → Blocked (or back to Queued)

### Task Properties
- Title, description, priority (low/medium/high), optional deadline
- Automatic timestamps (created, completed)
- Activity log tracking all changes

## Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

```bash
cd alex-dashboard

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Project Structure

```
alex-dashboard/
├── app/
│   ├── api/tasks/          # API routes for CRUD operations
│   │   ├── route.ts        # GET (fetch all) & POST (create)
│   │   └── [id]/route.ts   # PATCH (update) & DELETE
│   ├── globals.css         # Tailwind styles + custom components
│   ├── layout.tsx          # Root layout with metadata
│   └── page.tsx            # Main dashboard component
├── components/
│   ├── TaskCard.tsx        # Individual task card
│   ├── TaskQueue.tsx       # Task list + form
│   ├── ActiveWork.tsx      # Current task + stats
│   ├── CompletedTasks.tsx  # Completed tasks list
│   └── ActivityLog.tsx     # Action history log
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

### Data Storage

Tasks are stored in `../dashboard/tasks.json` (workspace-level):
- Persistent JSON file shared across instances
- API routes read/write to this file
- Includes task list and activity log

## Deployment to Vercel

### Prerequisites
- GitHub account with the repo
- Vercel account (free tier available)

### Step 1: Create GitHub Repository

```bash
cd C:\Users\jaden\.openclaw\workspace\alex-dashboard

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Alex Command Center MVP"

# Create repo on GitHub (https://github.com/new) and push
git remote add origin https://github.com/YOUR_USERNAME/alex-dashboard.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

#### Option A: Using Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts to connect your GitHub repo.

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel auto-detects Next.js - click "Deploy"

### Step 3: Configure Environment (Optional)

No environment variables required for MVP. To add in the future:
1. Go to Vercel Project Settings → Environment Variables
2. Add any secrets (API keys, etc.)

### Step 4: Set Data Storage

**Important**: The current MVP stores tasks in `../dashboard/tasks.json` (workspace-level).
For production, you have options:

**Option 1: Use Vercel KV (Redis)**
```bash
vercel env pull
```
Then update API routes to use Vercel KV instead of file system.

**Option 2: Use PostgreSQL/MongoDB**
Add a database service and update API routes to query your database.

**Option 3: Keep File System (current MVP)**
Ensure `/tmp` or persistent storage is available in Vercel's environment.

### Deploy Latest Changes

After making changes locally:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel automatically redeploys on push to main branch.

## Build & Production

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Create `.env.local` if needed:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Troubleshooting

### Port Already in Use
```bash
# Find process on port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

### Tasks.json Not Found
Ensure `workspace/dashboard/tasks.json` exists and is readable by the API.

### Build Fails
```bash
rm -r .next node_modules
npm install
npm run build
```

## Next Steps (Post-MVP)

1. **Database Migration**: Move from file-based storage to PostgreSQL/MongoDB
2. **Authentication**: Add user accounts and per-user task lists
3. **Notifications**: Email/SMS for deadlines and updates
4. **Collaboration**: Multi-user support with task assignments
5. **Advanced Filtering**: By assignee, due date, tags
6. **Dark/Light Mode Toggle**: Currently dark-only, add toggle
7. **Mobile App**: React Native version for iOS/Android
8. **Analytics**: Charts and reports on productivity

## Support

For issues or questions:
1. Check the GitHub repository
2. Review the component source code
3. Check Vercel logs: `vercel logs`

---

**Ready to deploy?**

Push to GitHub and Vercel will automatically build and host your dashboard!

```bash
git push origin main
```

Then watch your deployment at: `https://your-project.vercel.app`
