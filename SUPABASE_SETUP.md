# Supabase Backend Setup Guide

This guide will help you set up and configure Supabase as the backend for the Marketing Assessment Platform.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Database Schema](#database-schema)
6. [Features](#features)
7. [Authentication](#authentication)
8. [API Usage](#api-usage)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The Marketing Assessment Platform now uses Supabase as its backend to provide:

- **User Authentication** - Secure email/password authentication
- **Data Persistence** - Store user progress, assessment results, and bookmarks
- **Cross-Device Sync** - Access your data from any device
- **Real-time Updates** - Instant synchronization of data
- **Row Level Security** - User data is protected and isolated

---

## Prerequisites

- A Supabase account (free tier available at [supabase.com](https://supabase.com))
- Node.js installed on your machine
- Basic understanding of SQL (optional)

---

## Database Setup

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in your project details:
   - **Name**: Marketing Assessment Platform
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users
5. Wait for the project to be created (this may take a few minutes)

### Step 2: Run the SQL Migration

1. In your Supabase dashboard, navigate to the **SQL Editor**
2. Open the `supabase_setup.sql` file from your project root
3. Copy the entire SQL content
4. Paste it into the SQL Editor
5. Click **Run** to execute the script

This will create all necessary tables, security policies, and database functions.

### Step 3: Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (the public API key)

---

## Environment Configuration

Your `.env` file has already been created with your credentials:

```env
VITE_SUPABASE_URL=https://hxkptqkegbtuaezojnoa.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:**
- Never commit your `.env` file to version control
- Use `.env.example` as a template for other developers
- For production deployments, set these as environment variables in your hosting platform (Vercel, Netlify, etc.)

---

## Database Schema

### Tables Overview

#### 1. **profiles**
Extends Supabase auth.users with additional user profile data.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (references auth.users) |
| email | TEXT | User's email address |
| full_name | TEXT | User's full name |
| avatar_url | TEXT | URL to user's avatar image |
| created_at | TIMESTAMPTZ | Account creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

#### 2. **user_progress**
Tracks overall user progress across all assessments.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| total_questions_attempted | INTEGER | Total questions answered |
| total_correct_answers | INTEGER | Total correct answers |
| total_time_spent | INTEGER | Total time in seconds |
| average_score | NUMERIC | Average score across all assessments |
| last_active_at | TIMESTAMPTZ | Last activity timestamp |

#### 3. **assessment_results**
Stores individual assessment attempt results.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| category | TEXT | Assessment category (numerical, verbal, etc.) |
| score | NUMERIC | Score percentage (0-100) |
| total_questions | INTEGER | Number of questions in assessment |
| correct_answers | INTEGER | Number of correct answers |
| time_taken | INTEGER | Time taken in seconds |
| answers | JSONB | Array of answer details |
| completed_at | TIMESTAMPTZ | Completion timestamp |

#### 4. **bookmarked_questions**
Stores user's bookmarked questions for later review.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| question_id | TEXT | ID of the bookmarked question |
| category | TEXT | Question category |
| notes | TEXT | Optional user notes |
| created_at | TIMESTAMPTZ | Bookmark creation timestamp |

#### 5. **user_settings**
Stores user preferences and settings.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| theme | TEXT | UI theme (light/dark) |
| sound_enabled | BOOLEAN | Sound effects enabled |
| notifications_enabled | BOOLEAN | Notifications enabled |
| default_timer_duration | INTEGER | Default timer in minutes |
| preferred_language | TEXT | Preferred language (nl/en) |

#### 6. **category_statistics**
Aggregated statistics per category for each user.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| category | TEXT | Assessment category |
| attempts_count | INTEGER | Number of attempts |
| total_questions_answered | INTEGER | Total questions in category |
| total_correct_answers | INTEGER | Total correct in category |
| best_score | NUMERIC | Best score achieved |
| average_score | NUMERIC | Average score in category |
| total_time_spent | INTEGER | Total time in seconds |
| last_attempt_at | TIMESTAMPTZ | Last attempt timestamp |

---

## Features

### Automatic Database Triggers

The setup includes several automatic triggers:

1. **Auto-create profile** - When a user signs up, their profile, progress, and settings are automatically created
2. **Auto-update timestamps** - The `updated_at` field is automatically updated on record changes
3. **Auto-calculate statistics** - Category and overall statistics are automatically updated after each assessment

### Row Level Security (RLS)

All tables have Row Level Security enabled to ensure:
- Users can only access their own data
- Data is protected from unauthorized access
- Queries are automatically filtered by user ID

### Data Synchronization

The app automatically syncs data between local state and Supabase:
- **Assessment results** are saved after completion
- **Bookmarks** are synced when added/removed
- **User progress** is updated in real-time
- **Guest mode** allows using the app without authentication (data stored locally)

---

## Authentication

### Sign Up

```typescript
import { useAuthStore } from './stores/useAuthStore';

const { signUp } = useAuthStore();

// Sign up a new user
const result = await signUp('user@example.com', 'password123', 'John Doe');
```

### Sign In

```typescript
import { useAuthStore } from './stores/useAuthStore';

const { signIn } = useAuthStore();

// Sign in existing user
const result = await signIn('user@example.com', 'password123');
```

### Sign Out

```typescript
import { useAuthStore } from './stores/useAuthStore';

const { signOut } = useAuthStore();

// Sign out current user
await signOut();
```

### Using Auth Components

The app includes pre-built authentication components:

```typescript
import { AuthModal } from './components/Auth';

<AuthModal
  isOpen={showAuth}
  onClose={() => setShowAuth(false)}
  defaultView="login" // or "signup"
/>
```

---

## API Usage

### Supabase Service

All Supabase operations are available through the `supabaseService`:

```typescript
import { supabaseService } from './services/supabaseService';

// Save assessment result
await supabaseService.assessment.saveResult({
  category: 'numerical',
  score: 85,
  totalQuestions: 20,
  correctAnswers: 17,
  timeTaken: 1200,
  answers: [...],
});

// Get user progress
const { data, error } = await supabaseService.progress.getProgress();

// Add bookmark
await supabaseService.bookmark.addBookmark('question-123', 'verbal');

// Get all bookmarks
const { data, error } = await supabaseService.bookmark.getBookmarks();

// Get category statistics
const { data, error } = await supabaseService.statistics.getCategoryStats('numerical');
```

### Zustand Store Integration

The Zustand store automatically handles Supabase synchronization:

```typescript
import { useAppStore } from './stores/useAppStore';

const {
  addAssessmentSession,
  bookmarkQuestion,
  unbookmarkQuestion,
  loadUserData,
} = useAppStore();

// Load user data from Supabase (called automatically on auth)
await loadUserData();

// Add assessment (automatically syncs to Supabase)
await addAssessmentSession(session);

// Bookmark question (automatically syncs to Supabase)
await bookmarkQuestion('question-123', 'numerical');
```

---

## Troubleshooting

### Common Issues

#### 1. "Missing Supabase environment variables"

**Solution:** Ensure your `.env` file exists and contains valid values:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### 2. "User not authenticated" errors

**Solution:** Make sure the user is signed in before performing authenticated operations:
```typescript
const { user } = useAuthStore();
if (!user) {
  // Show login modal
}
```

#### 3. SQL migration fails

**Solution:**
- Ensure you're running the SQL in the correct Supabase project
- Check that no tables already exist with the same names
- Review the error message in the SQL Editor

#### 4. RLS policy errors

**Solution:**
- Verify that RLS is enabled on all tables
- Check that users are properly authenticated
- Review the policy definitions in the SQL file

#### 5. Data not syncing

**Solution:**
- Check browser console for errors
- Verify network connectivity
- Ensure Supabase project is active
- Check that user is authenticated

### Debug Mode

Enable debug logging in the browser console:

```typescript
// In your browser console
localStorage.debug = 'supabase:*'
```

---

## Next Steps

1. **Test Authentication** - Try signing up and logging in
2. **Take an Assessment** - Complete an assessment and verify it saves to Supabase
3. **Check the Dashboard** - View your data in the Supabase dashboard under "Table Editor"
4. **Add Features** - Extend the schema or add new functionality as needed

---

## Support

For issues or questions:
- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the SQL file: `supabase_setup.sql`
- Check the service layer: `src/services/supabaseService.ts`
- Inspect the database types: `src/types/database.ts`

---

## Security Notes

- Never expose your **service_role** key in client-side code
- The **anon** key is safe to use in the browser (it's public)
- Row Level Security (RLS) protects user data
- Always validate user input before saving to the database
- Use HTTPS in production
- Regularly review and audit your security policies

---

## License

This setup is part of the Marketing Assessment Platform project.
