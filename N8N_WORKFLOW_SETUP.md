# N8N Workflow Setup Guide
## Indeed RSS Feed Job Scraper for Marketing Vacancies

This guide will walk you through setting up the N8N Cloud workflow to automatically scrape marketing job postings from Indeed Netherlands using RSS feeds (legal and reliable).

---

## 📋 Prerequisites

Before you start, ensure you have:

1. ✅ **N8N Cloud account** (https://n8n.io/)
2. ✅ **Supabase project** with schema created (see `supabase-schema.sql`)
3. ✅ **Supabase credentials**:
   - Project URL
   - Service Role Key (NOT anon key - needed for N8N)
4. ✅ **Telegram Bot** (optional, for notifications):
   - Bot Token (from @BotFather)
   - Chat ID (your Telegram user ID)

---

## 🔧 Part 1: Configure N8N Credentials

### Step 1: Add Supabase Credentials

1. Go to N8N Cloud → **Credentials** → **New Credential**
2. Search for "**HTTP Request**" (we'll use generic HTTP for Supabase)
3. Configure:
   ```
   Name: Supabase - Indeed Jobs
   Authentication: Generic Credential Type
   Generic Auth Type: Header Auth

   Header:
     Name: apikey
     Value: [YOUR_SUPABASE_SERVICE_ROLE_KEY]

   Add another header:
     Name: Authorization
     Value: Bearer [YOUR_SUPABASE_SERVICE_ROLE_KEY]

   Add another header:
     Name: Content-Type
     Value: application/json
   ```

### Step 2: Add Telegram Credentials (Optional)

1. **Credentials** → **New Credential** → **Telegram**
2. Configure:
   ```
   Name: Telegram Bot - Job Alerts
   Access Token: [YOUR_TELEGRAM_BOT_TOKEN]
   ```

To get your Telegram credentials:
1. Message @BotFather on Telegram
2. Send `/newbot` and follow instructions
3. Copy the bot token
4. Get your Chat ID by messaging @userinfobot

---

## 🤖 Part 2: Create the Workflow

### Workflow Name: "Indeed NL - Marketing Jobs RSS Scraper"

### Node Structure Overview

```
[Schedule Trigger]
    ↓
[Get Active Queries (Supabase)]
    ↓
[Loop: For Each Query]
    ↓
[HTTP Request: Fetch RSS Feed]
    ↓
[XML Parser]
    ↓
[Function: Clean & Match Jobs]
    ↓
[Filter: Remove Existing Jobs]
    ↓
[HTTP Request: Insert to Supabase]
    ↓
[IF: New Jobs Found?]
    ↓ (TRUE)
[Send Telegram Notification]
```

---

## 📝 Detailed Node Configuration

### Node 1: Schedule Trigger
```
Type: Schedule Trigger
Trigger Interval: Every 15 minutes
Rule: */15 * * * *
```

---

### Node 2: Get Active Search Queries
```
Type: HTTP Request
Method: GET
URL: {{$env.SUPABASE_URL}}/rest/v1/search_queries?is_active=eq.true&select=*
Authentication: Use "Supabase - Indeed Jobs" credential
```

---

### Node 3: Loop Over Items
```
Type: Loop Over Items
Batch Size: 1
```

---

### Node 4: Fetch RSS Feed
```
Type: HTTP Request
Method: GET
URL: {{$json.rss_url}}

Headers:
  User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36

Response Format: String
Ignore SSL Issues: No
```

**Example RSS URL format:**
```
https://nl.indeed.com/rss?q=marketing+manager&l=Nederland&sort=date
```

---

### Node 5: XML to JSON
```
Type: XML
Operation: XML to JSON
Property Name: data
Options:
  - Normalize: true
  - Trim: true
  - Explicit Array: false
```

---

### Node 6: Extract Job Items
```
Type: Function
JavaScript Code:
```

```javascript
// Extract items from RSS feed
const rssData = $input.first().json.data;
const channel = rssData.rss?.channel;
const searchQuery = $('Loop Over Items').item.json;

if (!channel || !channel.item) {
  return [];
}

// Ensure items is an array
const items = Array.isArray(channel.item) ? channel.item : [channel.item];

return items.map(item => ({
  json: {
    title: item.title?.[0] || item.title || '',
    company: extractCompany(item.title?.[0] || item.title || ''),
    location: extractLocation(item.description?.[0] || item.description || ''),
    description: item.description?.[0] || item.description || '',
    job_url: item.link?.[0] || item.link || '',
    posted_date: item.pubDate?.[0] || item.pubDate || new Date().toISOString(),
    search_query: searchQuery.keywords,
    job_id: extractJobId(item.link?.[0] || item.link || ''),
    snippet: truncateText(item.description?.[0] || item.description || '', 200),
  }
}));

// Helper functions
function extractCompany(title) {
  // Extract company from title (format: "Job Title - Company Name")
  const match = title.match(/\s*[-–]\s*(.+?)(?:\s*[-–]\s*|$)/);
  return match ? match[1].trim() : 'Onbekend';
}

function extractLocation(description) {
  // Try to extract location from description
  const locationMatch = description.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*,?\s*Netherlands?\b/i);
  if (locationMatch) return locationMatch[1];

  // Common Dutch cities
  const cities = ['Amsterdam', 'Rotterdam', 'Utrecht', 'Den Haag', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere', 'Breda', 'Nijmegen'];
  for (const city of cities) {
    if (description.toLowerCase().includes(city.toLowerCase())) {
      return city;
    }
  }

  return 'Nederland';
}

function extractJobId(url) {
  // Extract job ID from Indeed URL
  const match = url.match(/jk=([a-f0-9]+)/);
  return match ? match[1] : `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function truncateText(text, maxLength) {
  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, '').trim();
  if (cleanText.length <= maxLength) return cleanText;
  return cleanText.substr(0, maxLength) + '...';
}
```

---

### Node 7: Enrich with Assessment Matching
```
Type: Function
JavaScript Code:
```

```javascript
// Import matching logic (simplified version for N8N)
const items = $input.all();

return items.map(item => {
  const job = item.json;
  const allText = `${job.title} ${job.company} ${job.description}`.toLowerCase();

  // Detect experience level
  let experience_level = 'Onbekend';
  if (/senior|head of|director|cmo|chief/i.test(allText)) {
    experience_level = 'Senior';
  } else if (/medior|manager|specialist/i.test(allText)) {
    experience_level = 'Medior';
  } else if (/junior|assistant/i.test(allText)) {
    experience_level = 'Junior';
  }

  // Match assessment types
  const matched_types = [];
  let score = 0;

  // Keyword matching
  if (/budget|roi|kpi|metrics|analytics|data/i.test(allText)) {
    matched_types.push('numerical');
    score += 15;
  }
  if (/content|copywriting|communication|storytelling/i.test(allText)) {
    matched_types.push('verbal');
    score += 15;
  }
  if (/stakeholder|leadership|team|management/i.test(allText)) {
    matched_types.push('situational');
    score += 15;
  }
  if (/strategy|strategic|campaign|planning/i.test(allText)) {
    matched_types.push('case-study');
    score += 20;
  }
  if (/google analytics|facebook ads|seo|sem|automation/i.test(allText)) {
    matched_types.push('technical');
    score += 15;
  }
  if (/leadership|behavioral|star method/i.test(allText)) {
    matched_types.push('behavioral');
    score += 10;
  }
  if (/analytical|critical thinking|problem-solving/i.test(allText)) {
    matched_types.push('logical');
    score += 10;
  }

  // Default assessment types for marketing roles
  if (matched_types.length === 0) {
    matched_types.push('situational', 'case-study', 'behavioral');
    score = 40;
  }

  return {
    json: {
      ...job,
      experience_level,
      matched_assessment_types: matched_types,
      matching_score: Math.min(score, 100),
      scraped_at: new Date().toISOString(),
      is_new: true,
    }
  };
});
```

---

### Node 8: Check Existing Jobs
```
Type: HTTP Request
Method: POST
URL: {{$env.SUPABASE_URL}}/rest/v1/rpc/check_job_exists

Authentication: Use "Supabase - Indeed Jobs" credential

Body (JSON):
{
  "job_ids": {{ $json.job_id }}
}

OR use simpler approach - GET with filter:
Method: GET
URL: {{$env.SUPABASE_URL}}/rest/v1/indeed_jobs?job_id=eq.{{$json.job_id}}&select=job_id
```

---

### Node 9: Filter New Jobs Only
```
Type: Function
JavaScript Code:
```

```javascript
const jobsToInsert = $('Enrich with Assessment Matching').all();
const existingJobs = $input.all();
const existingJobIds = new Set(existingJobs.map(j => j.json.job_id));

const newJobs = jobsToInsert.filter(job => !existingJobIds.has(job.json.job_id));

if (newJobs.length === 0) {
  return [{ json: { message: 'No new jobs found' } }];
}

return newJobs;
```

---

### Node 10: Insert New Jobs to Supabase
```
Type: HTTP Request
Method: POST
URL: {{$env.SUPABASE_URL}}/rest/v1/indeed_jobs

Authentication: Use "Supabase - Indeed Jobs" credential

Headers:
  Prefer: return=representation

Body (JSON):
Use "Expression" mode and select all job fields from previous node
```

**Body template:**
```json
{
  "job_id": "={{$json.job_id}}",
  "title": "={{$json.title}}",
  "company": "={{$json.company}}",
  "location": "={{$json.location}}",
  "description": "={{$json.description}}",
  "snippet": "={{$json.snippet}}",
  "job_url": "={{$json.job_url}}",
  "posted_date": "={{$json.posted_date}}",
  "scraped_at": "={{$json.scraped_at}}",
  "search_query": "={{$json.search_query}}",
  "experience_level": "={{$json.experience_level}}",
  "matched_assessment_types": "={{$json.matched_assessment_types}}",
  "matching_score": "={{$json.matching_score}}",
  "is_new": true,
  "source": "indeed_rss"
}
```

---

### Node 11: Count New Jobs
```
Type: Function
JavaScript Code:
```

```javascript
const newJobs = $input.all();
return [{
  json: {
    count: newJobs.length,
    jobs: newJobs.map(j => j.json)
  }
}];
```

---

### Node 12: IF - New Jobs Found?
```
Type: IF
Conditions:
  Value 1: {{$json.count}}
  Operation: Larger
  Value 2: 0
```

---

### Node 13: Format Telegram Message
```
Type: Function
JavaScript Code:
```

```javascript
const data = $input.first().json;
const count = data.count;
const jobs = data.jobs.slice(0, 5); // Show max 5 jobs

let message = `🎯 *${count} nieuwe marketing vacature${count > 1 ? 's' : ''} gevonden!*\n\n`;

jobs.forEach((job, idx) => {
  message += `*${idx + 1}. ${job.title}*\n`;
  message += `🏢 ${job.company}\n`;
  message += `📍 ${job.location}\n`;
  if (job.experience_level && job.experience_level !== 'Onbekend') {
    message += `🎓 ${job.experience_level}\n`;
  }
  if (job.matching_score && job.matching_score > 0) {
    message += `📊 Match: ${job.matching_score}%\n`;
  }
  message += `🔗 ${job.job_url}\n\n`;
});

if (count > 5) {
  message += `_...en nog ${count - 5} andere vacatures_\n\n`;
}

message += `📱 Bekijk alle vacatures in de Marketing Assessment app!`;

return [{
  json: {
    message,
    chat_id: process.env.TELEGRAM_CHAT_ID
  }
}];
```

---

### Node 14: Send Telegram Notification
```
Type: Telegram
Operation: Send Message
Chat ID: {{$json.chat_id}}
Text: {{$json.message}}
Parse Mode: Markdown
Disable Web Page Preview: true
```

---

### Node 15: Update Query Stats
```
Type: HTTP Request
Method: PATCH
URL: {{$env.SUPABASE_URL}}/rest/v1/search_queries?id=eq.{{$('Loop Over Items').item.json.id}}

Authentication: Use "Supabase - Indeed Jobs" credential

Body (JSON):
{
  "last_run": "{{new Date().toISOString()}}",
  "jobs_found_count": "={{$('Count New Jobs').first().json.count}}"
}
```

---

## 🔐 Part 3: Environment Variables

In N8N Cloud, set these environment variables:

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
TELEGRAM_CHAT_ID=your-telegram-chat-id
```

Go to: **Settings** → **Environment Variables** → **Add Variable**

---

## ✅ Part 4: Testing the Workflow

### Step 1: Test Individual Nodes
1. Click "Execute Node" on each node to test independently
2. Verify data flows correctly between nodes
3. Check Supabase to ensure data is inserted

### Step 2: Test Full Workflow
1. Click "Execute Workflow" (top right)
2. Monitor execution in real-time
3. Check for any errors

### Step 3: Verify Results
1. Go to Supabase → Table Editor → `indeed_jobs`
2. Verify new jobs are inserted
3. Check if Telegram notification was sent

---

## 🚀 Part 5: Activate the Workflow

1. Click **"Active"** toggle (top right)
2. Workflow will now run every 15 minutes automatically
3. Monitor executions in **Executions** tab

---

## 📊 Monitoring & Maintenance

### Check Workflow Status
- Go to N8N → **Workflows** → "Indeed NL - Marketing Jobs RSS Scraper"
- View recent executions
- Check error logs if any failures

### Common Issues & Solutions

**Issue 1: No jobs found**
- Solution: Check RSS URL is accessible
- Verify search queries in Supabase `search_queries` table

**Issue 2: Duplicate jobs inserted**
- Solution: Verify duplicate check logic in "Filter New Jobs Only" node
- Ensure `job_id` extraction is consistent

**Issue 3: Telegram not sending**
- Solution: Verify bot token and chat ID
- Check if bot is started (send /start to your bot)

**Issue 4: Supabase connection errors**
- Solution: Verify service role key (NOT anon key)
- Check RLS policies allow service role access

---

## 🔄 Updating Search Queries

To add new search queries:

1. Go to Supabase → Table Editor → `search_queries`
2. Insert new row:
   ```sql
   INSERT INTO search_queries (keywords, location, experience_level, rss_url, is_active)
   VALUES (
     'performance marketing manager',
     'Nederland',
     ARRAY['Medior', 'Senior'],
     'https://nl.indeed.com/rss?q=performance+marketing+manager&l=Nederland&sort=date',
     true
   );
   ```

The workflow will automatically pick up new queries on the next run.

---

## 📈 Performance Optimization

### Reduce API Calls
- Increase schedule interval to 30 minutes if 15 is too frequent
- Batch process multiple jobs at once

### Improve Matching Accuracy
- Update matching keywords in Node 7 based on real job data
- Add company-specific matching logic

### Storage Management
- Old jobs (90+ days) are auto-cleaned by Supabase function
- Manually run: `SELECT cleanup_old_jobs();` in Supabase SQL editor

---

## 🎉 You're Done!

Your Indeed job monitoring system is now:
- ✅ Automatically scraping jobs every 15 minutes
- ✅ Matching jobs to assessment types
- ✅ Sending Telegram notifications
- ✅ Displaying jobs in your app

**Next Steps:**
1. Monitor for first 24 hours
2. Adjust search queries based on results
3. Fine-tune assessment matching logic
4. Customize Telegram notification format

---

## 🆘 Need Help?

- N8N Documentation: https://docs.n8n.io/
- Supabase Documentation: https://supabase.com/docs
- Indeed RSS Feed Format: https://www.indeed.com/rss

**Troubleshooting Tips:**
- Check N8N execution logs for errors
- Verify Supabase connection in SQL editor
- Test RSS URLs in browser first
- Use N8N "Execute Node" to debug step by step
