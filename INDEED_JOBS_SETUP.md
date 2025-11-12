# Indeed Vacancy Monitoring Setup Guide
## Complete Implementation Guide for Real-Time Job Tracking

This guide provides step-by-step instructions for setting up the Indeed vacancy monitoring system integrated with your Marketing Assessment Platform.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Part 1: Supabase Setup](#part-1-supabase-setup)
4. [Part 2: N8N Workflow Setup](#part-2-n8n-workflow-setup)
5. [Part 3: Frontend Configuration](#part-3-frontend-configuration)
6. [Part 4: Testing](#part-4-testing)
7. [Part 5: Deployment](#part-5-deployment)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

### What You're Building

A complete job monitoring system that:
- ✅ Automatically scrapes Indeed RSS feeds every 15 minutes
- ✅ Stores jobs in Supabase PostgreSQL database
- ✅ Matches jobs with assessment types using AI logic
- ✅ Displays jobs in your React app with filters
- ✅ Sends Telegram notifications for new jobs
- ✅ Provides real-time updates via Supabase subscriptions

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Indeed RSS Feeds                       │
│  (Legal, reliable, updated every few hours)             │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              N8N Cloud Workflow                         │
│  - Fetches RSS feeds every 15 min                       │
│  - Parses XML to JSON                                   │
│  - Extracts job data                                    │
│  - Matches jobs to assessments                          │
│  - Removes duplicates                                   │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│                Supabase Database                        │
│  - PostgreSQL with full-text search                     │
│  - Row Level Security enabled                           │
│  - Real-time subscriptions                              │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ├──────────────────┐
                   │                  │
                   ▼                  ▼
┌──────────────────────────┐  ┌──────────────────┐
│  React Frontend          │  │  Telegram Bot    │
│  - Job listings          │  │  - New job       │
│  - Filters & search      │  │    alerts        │
│  - Real-time updates     │  │                  │
└──────────────────────────┘  └──────────────────┘
```

---

## 🛠️ Prerequisites

Before starting, ensure you have:

### Required Accounts
- [ ] **Supabase account** (free tier) - https://supabase.com/
- [ ] **N8N Cloud account** (free tier) - https://n8n.io/
- [ ] **Telegram account** (for notifications)

### Required Tools
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

### Optional
- [ ] Vercel account (for deployment)
- [ ] Domain name (optional)

---

## 📦 Part 1: Supabase Setup

### Step 1.1: Create Supabase Project

1. Go to https://app.supabase.com/
2. Click **"New Project"**
3. Configure:
   - Name: `marketing-assessment-jobs`
   - Database Password: Generate strong password (save it!)
   - Region: Choose closest to Netherlands (Europe West)
   - Pricing: Free tier is fine

4. Wait 2-3 minutes for project to be created

### Step 1.2: Run Database Schema

1. In Supabase Dashboard → **SQL Editor**
2. Click **"New Query"**
3. Copy entire contents of `supabase-schema.sql`
4. Paste into SQL editor
5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. Verify success: You should see "Success. No rows returned"

### Step 1.3: Verify Tables Created

1. Go to **Table Editor** (left sidebar)
2. You should see:
   - `indeed_jobs` (main table)
   - `search_queries` (with 9 default queries)
   - `user_job_interactions` (for future multi-user)

3. Click on `search_queries` table
4. Verify 9 rows exist with RSS URLs

### Step 1.4: Get API Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   ```
   Project URL: https://xxxxx.supabase.co
   anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Important:**
   - `anon key` = for frontend (safe to expose)
   - `service_role key` = for N8N only (keep secret!)

### Step 1.5: Test Database Connection

1. In SQL Editor, run:
   ```sql
   SELECT * FROM search_queries WHERE is_active = true;
   ```

2. You should see 9 active search queries

3. Run:
   ```sql
   SELECT get_job_stats();
   ```

4. Should return stats (all zeros initially)

✅ **Supabase setup complete!**

---

## 🤖 Part 2: N8N Workflow Setup

Detailed steps are in `N8N_WORKFLOW_SETUP.md`

### Quick Start:

1. Go to https://app.n8n.cloud/
2. Create new workflow: "Indeed NL - Marketing Jobs"
3. Follow step-by-step guide in `N8N_WORKFLOW_SETUP.md`
4. Test each node individually
5. Activate workflow

**Estimated time:** 30-45 minutes

---

## 💻 Part 3: Frontend Configuration

### Step 3.1: Install Dependencies

Already done! ✅ (Supabase package installed)

Verify in `package.json`:
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0"
  }
}
```

### Step 3.2: Configure Environment Variables

1. Create `.env` file in project root:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Anthropic (existing)
   VITE_ANTHROPIC_API_KEY=sk-ant-...
   ```

3. **Important:** Use `anon key`, NOT `service_role key`

### Step 3.3: Test Locally

1. Start development server:
   ```bash
   npm run dev
   ```

2. Open browser to `http://localhost:5173`

3. You should see:
   - Landing page loads normally
   - New "Marketing Vacatures" section below Quick Start
   - "Geen vacatures gevonden" message (no jobs yet)

4. Check browser console for errors
   - If you see Supabase connection errors, check `.env` file

### Step 3.4: Add Test Job (Optional)

Manually add a test job to verify UI works:

1. In Supabase → **SQL Editor**, run:
   ```sql
   INSERT INTO indeed_jobs (
     job_id, title, company, location, description, snippet,
     job_url, posted_date, search_query, experience_level,
     matched_assessment_types, matching_score, is_new
   ) VALUES (
     'test-job-001',
     'Marketing Manager',
     'Test Company BV',
     'Amsterdam, Nederland',
     'We are looking for an experienced marketing manager...',
     'We are looking for an experienced marketing manager with strong analytical skills.',
     'https://nl.indeed.com/viewjob?jk=test-job-001',
     NOW(),
     'marketing manager',
     'Medior',
     ARRAY['case-study', 'numerical', 'situational'],
     75,
     true
   );
   ```

2. Refresh your app
3. You should see the test job appear!

### Step 3.5: Test Real-Time Updates

1. Keep your app open in browser
2. In Supabase SQL Editor, insert another test job (change `job_id`)
3. Job should appear in app within 1-2 seconds (no page refresh!)

If real-time works, you'll see:
- New job appears instantly
- "NIEUW" badge on the job card
- New jobs count badge in header

---

## ✅ Part 4: Testing

### Test Checklist

#### Supabase Database
- [ ] Tables created successfully
- [ ] Sample queries run without errors
- [ ] RLS policies in place
- [ ] Search queries populated

#### N8N Workflow
- [ ] Workflow saves without errors
- [ ] Manual execution completes successfully
- [ ] Jobs inserted into Supabase
- [ ] Telegram notification received
- [ ] Workflow activated (runs every 15 min)

#### Frontend
- [ ] App loads without errors
- [ ] Job Board section visible
- [ ] Filters work (Medior, Senior, Search)
- [ ] Job cards display correctly
- [ ] Favorite button works
- [ ] "Bekijk vacature" opens Indeed page
- [ ] Real-time updates work

#### Assessment Matching
- [ ] Jobs have matched assessment types
- [ ] Matching score displayed
- [ ] Assessment badges shown

---

## 🚀 Part 5: Deployment

### Option A: Vercel (Recommended)

1. Commit all changes:
   ```bash
   git add .
   git commit -m "Add Indeed vacancy monitoring feature"
   git push origin main
   ```

2. Go to https://vercel.com/
3. Import your repository
4. Configure environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ANTHROPIC_API_KEY` (if using Quick Answer)

5. Deploy!

6. Your app will be live at: `https://your-app.vercel.app`

### Option B: Netlify

1. Configure `netlify.toml` (already exists)
2. Add environment variables in Netlify UI
3. Deploy from Git

### Post-Deployment Checklist

- [ ] Production app loads correctly
- [ ] Jobs are displayed
- [ ] Real-time updates work in production
- [ ] No CORS errors in console
- [ ] Filters and search work
- [ ] Mobile responsive

---

## 🐛 Troubleshooting

### Issue 1: No jobs appearing

**Possible causes:**
1. N8N workflow not activated
2. Supabase connection failed
3. No jobs scraped yet (wait 15 minutes)

**Solutions:**
1. Check N8N workflow is "Active" (green toggle)
2. Verify `.env` has correct Supabase credentials
3. Manually insert test job (see Step 3.4)
4. Check browser console for errors

### Issue 2: Real-time updates not working

**Possible causes:**
1. Supabase real-time not enabled
2. WebSocket connection blocked

**Solutions:**
1. In Supabase → Database → Replication
2. Enable real-time for `indeed_jobs` table
3. Check browser console for WebSocket errors
4. Try different browser

### Issue 3: N8N workflow failing

**Possible causes:**
1. Invalid RSS feed URL
2. Supabase credentials incorrect
3. Rate limiting

**Solutions:**
1. Test RSS URLs in browser first
2. Verify service_role key (not anon key) in N8N
3. Increase interval to 30 minutes
4. Check N8N execution logs

### Issue 4: Telegram notifications not sending

**Possible causes:**
1. Bot token invalid
2. Chat ID incorrect
3. Bot not started

**Solutions:**
1. Verify bot token from @BotFather
2. Get chat ID from @userinfobot
3. Send `/start` to your bot
4. Test notification manually in N8N

### Issue 5: Assessment matching not accurate

**Solutions:**
1. Review job descriptions in Supabase
2. Update matching keywords in `jobMatchingService.ts`
3. Add more company profiles to `COMPANY_ASSESSMENT_PROFILES`
4. Adjust scoring weights

### Issue 6: CORS errors

**Possible causes:**
1. Supabase RLS blocking requests
2. Wrong API key used

**Solutions:**
1. Verify RLS policies allow anon access
2. Check using anon key (not service_role key) in frontend
3. Test Supabase connection in browser console:
   ```javascript
   const { createClient } = await import('@supabase/supabase-js');
   const supabase = createClient('YOUR_URL', 'YOUR_ANON_KEY');
   const { data } = await supabase.from('indeed_jobs').select('*').limit(1);
   console.log(data);
   ```

---

## 📊 Monitoring & Maintenance

### Daily Checks
- [ ] Check N8N execution history (any failures?)
- [ ] Verify new jobs are being added
- [ ] Test app functionality

### Weekly Maintenance
- [ ] Review job matching accuracy
- [ ] Update search queries if needed
- [ ] Check database size (free tier = 500MB)

### Monthly Tasks
- [ ] Run cleanup function: `SELECT cleanup_old_jobs();`
- [ ] Review Telegram notifications
- [ ] Analyze job statistics

### Database Statistics

Check job stats regularly:
```sql
SELECT * FROM get_job_stats();
```

Expected after 1 week:
- Total jobs: 200-500
- New jobs: 10-30
- Jobs last 24h: 20-50

### Performance Optimization

If database grows too large:
1. Reduce cleanup interval (90 days → 60 days)
2. Remove duplicate jobs:
   ```sql
   DELETE FROM indeed_jobs
   WHERE id NOT IN (
     SELECT MIN(id) FROM indeed_jobs GROUP BY job_id
   );
   ```

---

## 🎓 Understanding the System

### How Job Matching Works

The system uses keyword matching and company profiles to suggest assessments:

1. **Company-based** (30%): Known companies (Google, Unilever, etc.)
2. **Keyword-based** (40%): Job description analysis
3. **Seniority-based** (20%): Senior vs Medior roles
4. **Industry-based** (10%): Marketing specialization

### Search Queries Strategy

Current queries target:
- Marketing managers (general)
- Brand managers
- Digital marketing
- Performance marketing
- Content marketing
- Senior positions (CMO, Director, Head of)

Medior and Senior only (as requested).

### RSS Feed Limitations

Indeed RSS feeds:
- ✅ Legal to use
- ✅ Reliable
- ✅ Updated regularly
- ❌ Limited to 50 jobs per feed
- ❌ Less detail than full scraping
- ❌ No salary info usually

### Data Flow

```
RSS Feed → N8N → Parse XML → Extract Data → Match Assessments
  → Check Duplicates → Insert to DB → Notify Telegram → Display in App
```

---

## 🔒 Security Best Practices

### API Keys
- ✅ Never commit `.env` file to Git
- ✅ Use environment variables in production
- ✅ Rotate service_role key periodically
- ✅ Use anon key for frontend only

### Database
- ✅ RLS policies enabled
- ✅ Service role for N8N only
- ✅ No sensitive data stored
- ✅ Regular backups via Supabase

### Application
- ✅ No user authentication required yet
- ✅ Read-only access for anonymous users
- ✅ Rate limiting via Supabase
- ✅ HTTPS only in production

---

## 📈 Future Enhancements

### Phase 2 Features
1. **Email digests**: Daily job summary via email
2. **Job alerts**: Custom notifications per user
3. **Application tracking**: Track which jobs you applied to
4. **Interview prep**: Auto-generate interview questions per job
5. **Salary insights**: Aggregate salary data
6. **Company research**: Integrate Glassdoor ratings
7. **Cover letter generator**: AI-powered using Claude

### Phase 3 Features
1. **User authentication**: Supabase Auth
2. **Multi-user support**: Personal job lists
3. **Advanced matching**: ML-based recommendations
4. **Calendar integration**: Interview scheduling
5. **Resume optimizer**: Tailor resume per job
6. **Application analytics**: Success rate tracking

---

## 🎉 Success Criteria

Your system is working correctly when:

- ✅ New jobs appear automatically every 15-30 minutes
- ✅ Telegram notifications arrive for new matches
- ✅ Job cards display with assessment recommendations
- ✅ Filters work smoothly
- ✅ No errors in browser console
- ✅ Real-time updates work without refresh
- ✅ Mobile responsive design works

---

## 📞 Support & Resources

### Documentation
- Supabase Docs: https://supabase.com/docs
- N8N Docs: https://docs.n8n.io/
- React Query: https://tanstack.com/query/latest

### Community
- Supabase Discord: https://discord.supabase.com/
- N8N Community: https://community.n8n.io/

### Issues
If you encounter problems:
1. Check troubleshooting section above
2. Review N8N execution logs
3. Check Supabase logs
4. Test each component independently

---

## ✨ Congratulations!

You now have a fully functional Indeed vacancy monitoring system integrated with your Marketing Assessment Platform!

**What you've built:**
- Automated job scraping (legal & reliable)
- Smart assessment matching
- Real-time updates
- Telegram notifications
- Beautiful job listings UI

**Next steps:**
1. Monitor for 24-48 hours
2. Adjust search queries based on results
3. Fine-tune assessment matching
4. Share with users and get feedback!

Happy job hunting! 🚀
