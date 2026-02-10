# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in/create account
2. Click "New Project"
3. Choose a name and set a strong database password
4. Wait for the project to finish setting up (~2 minutes)

## 2. Run the Database Schema

1. In your Supabase dashboard, go to the **SQL Editor** tab
2. Click "New Query"
3. Copy the contents of `supabase-schema.sql` from this repo
4. Paste into the SQL editor and click "Run"
5. Verify tables were created in the **Table Editor** tab

## 3. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Project Settings** (gear icon)
2. Click **API** in the left sidebar
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (under "Project API keys")

## 4. Set Up Environment Variables

1. Create a `.env.local` file in the project root (copy from `.env.local.example`)
2. Add your credentials:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
\`\`\`

3. Restart your dev server: `npm run dev`

## 5. Deploy to Vercel

1. In Vercel dashboard, go to your project settings
2. Navigate to **Environment Variables**
3. Add the same two variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy your app

## Done!

Your dashboard should now connect to Supabase for all data operations. Test by:
- Creating a task
- Spawning an agent
- Checking the activity log

All data will persist in your Supabase database.
