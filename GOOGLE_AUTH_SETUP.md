# Google OAuth Authentication Setup Guide

This guide will walk you through setting up Google OAuth authentication with Supabase for your Marketing Assessment Platform.

## Prerequisites

- A Supabase account ([https://supabase.com](https://supabase.com))
- Your Supabase project (already exists: `Tekstbuddy`)
- Google OAuth credentials (already configured in your Supabase dashboard)

## Step 1: Set Up Database Schema

1. Go to your Supabase Dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: **Tekstbuddy**
3. Navigate to **SQL Editor** in the left sidebar
4. Copy the entire contents of the `supabase_schema.sql` file from the project root
5. Paste it into the SQL Editor
6. Click **Run** to execute the SQL commands

This will create:
- `user_profiles` table with Row Level Security (RLS)
- `assessment_sessions` table with RLS
- `assessment_results` table with RLS
- `bookmarked_questions` table with RLS
- Automatic triggers for user profile creation
- Views for user progress summary

## Step 2: Configure Environment Variables

1. In your Supabase Dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Create a `.env` file in the project root (copy from `.env.example`):

```bash
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Anthropic API Key (Optional - for Quick Answer feature)
VITE_ANTHROPIC_API_KEY=your-anthropic-key-here
```

**Important:** Replace `your-anon-key-here` with your actual Supabase anon key from the dashboard.

## Step 3: Verify Google OAuth Configuration

Your Google OAuth should already be configured in Supabase. To verify it's enabled:
1. Go to **Authentication** → **Providers** in your Supabase Dashboard
2. Ensure **Google** is **Enabled**
3. The configuration should match the values shown in your screenshot

## Step 4: Add Redirect URLs for Local Development

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Add the following to **Redirect URLs**:
   - `http://localhost:5173/` (for local development)
   - `http://localhost:5173/**` (wildcard for all local routes)
3. Click **Save**

## Step 5: Test the Setup

1. Install dependencies (if not already done):
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

4. You should see the **Login Page** with the "Continue with Google" button

5. Click the button to test the authentication flow:
   - You'll be redirected to Google's sign-in page
   - After signing in, you'll be redirected back to your app
   - You should see the onboarding flow (if first time) or the main dashboard

## How It Works

### Authentication Flow

1. **User clicks "Continue with Google"**
   - Triggers `signInWithGoogle()` from `AuthContext`
   - Redirects to Google OAuth consent screen

2. **User authorizes the app**
   - Google redirects back to your app with an auth code
   - Supabase exchanges the code for a session token
   - User is now authenticated

3. **Profile Creation**
   - A database trigger automatically creates a user profile entry
   - User completes onboarding to set their role, industry, and experience
   - Profile is synced to Supabase with RLS protecting their data

4. **Data Persistence**
   - All assessment results, bookmarks, and progress are saved to Supabase
   - Row Level Security (RLS) ensures users can only access their own data
   - Data syncs automatically in the background after each action

### Row Level Security (RLS)

RLS policies ensure that:
- Users can only view, create, and update their own data
- No user can access another user's assessment results or bookmarks
- All database queries are automatically filtered by the authenticated user's ID

Example RLS policy:
```sql
CREATE POLICY "Users can view their own assessment sessions"
  ON assessment_sessions
  FOR SELECT
  USING (auth.uid() = user_id);
```

## Architecture Overview

### Frontend Components

- **`src/contexts/AuthContext.tsx`**: Manages authentication state and provides auth functions
- **`src/components/auth/LoginPage.tsx`**: Google OAuth login UI
- **`src/lib/supabase.ts`**: Supabase client configuration
- **`src/lib/supabaseSync.ts`**: Helper functions for syncing data with Supabase
- **`src/stores/useAppStore.ts`**: Zustand store with Supabase sync integration

### Data Flow

```
User Action → Zustand Store → Local State Update → Supabase Sync (background)
                                     ↓
                            UI Updates Immediately
                                     ↓
                          Supabase Confirms Save
```

This approach provides:
- **Optimistic updates**: UI responds immediately
- **Background sync**: Data saves without blocking the user
- **Offline resilience**: Works with poor connections (with eventual consistency)

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution:** Make sure you've created a `.env` file with the correct values from your Supabase dashboard.

### Issue: Google login redirects but doesn't work

**Solution:**
1. Check that the redirect URL is added in Supabase Dashboard under **Authentication** → **URL Configuration**
2. Verify that Google OAuth is enabled in **Authentication** → **Providers**

### Issue: Database errors after login

**Solution:** Make sure you've run the SQL schema from `supabase_schema.sql` in the Supabase SQL Editor.

### Issue: Data not saving

**Solution:**
1. Check browser console for errors
2. Verify RLS policies are created (run the schema SQL again)
3. Ensure user is authenticated (check `user` in AuthContext)

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use environment variables** - Never hardcode API keys in your code
3. **RLS is enabled by default** - All tables have RLS policies to protect user data
4. **HTTPS in production** - Always use HTTPS for production deployments
5. **Validate redirect URLs** - Only whitelist trusted domains in Supabase

## Database Schema

### Tables Created

1. **`user_profiles`**
   - Stores user profile information
   - Linked to `auth.users` via foreign key
   - Automatically created on signup via trigger

2. **`assessment_sessions`**
   - Stores completed assessment sessions
   - Includes score, difficulty, type, timestamps

3. **`assessment_results`**
   - Individual question results for each session
   - Tracks correctness, time spent, user answers

4. **`bookmarked_questions`**
   - Stores user's bookmarked questions
   - Unique constraint prevents duplicate bookmarks

## Next Steps

After completing the setup:

1. **Test the complete flow:**
   - Sign in with Google
   - Complete onboarding
   - Take an assessment
   - View your dashboard
   - Bookmark questions
   - Sign out and sign back in to verify data persistence

2. **Deploy to production:**
   - Add your production domain to Supabase redirect URLs
   - Update `.env` for production (use environment variables in Vercel/Netlify)
   - Verify Google OAuth callback URL works in production

3. **Monitor usage:**
   - Check Supabase Dashboard for user activity
   - Review database usage and storage
   - Monitor API calls and quotas

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Review Supabase logs in the Dashboard
3. Verify all environment variables are set correctly
4. Ensure the database schema was created successfully

---

**Last Updated:** 2025-11-12
