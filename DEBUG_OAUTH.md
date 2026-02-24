# Debug: OAuth Redirect Issue

## Check These Settings

### 1. Verify Vercel Environment Variable

In Vercel Dashboard:
- Go to your project → Settings → Environment Variables
- Check if `NEXT_PUBLIC_APP_URL` exists
- Value should be: `https://www.getcitizenship.com.au`
- Should be enabled for **Production** environment

### 2. Check if Redeployed

Environment variables only work after a new deployment:
- After adding the env var, you MUST redeploy
- Go to Deployments → Click "..." → Redeploy

### 3. Check Supabase Settings

**Critical:** You need to add your production URL to Supabase too!

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Add to **Site URL:** `https://www.getcitizenship.com.au`
5. Add to **Redirect URLs:**
   ```
   https://www.getcitizenship.com.au/auth/callback
   ```
6. Click **Save**

### 4. Check Google Cloud Console

Make sure the production callback URL is in Google OAuth settings:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials
3. Edit your OAuth client
4. Add to **Authorized redirect URIs:**
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
   (Replace YOUR_PROJECT_REF with your actual Supabase project reference)

### 5. Test Environment Variable

Add a test to verify the env var is working:

Visit: https://www.getcitizenship.com.au

Open browser console (F12) and run:
```javascript
console.log('APP URL:', process.env.NEXT_PUBLIC_APP_URL)
```

If it shows `undefined`, the env var is not set correctly.

## Quick Fix

If the env var is not working, I can hardcode the production URL in the code. Would you like me to do that?

## Debug Steps

1. Check Vercel env var is set (screenshot?)
2. Check if you redeployed after adding it
3. Check Supabase URL Configuration
4. Check Google OAuth redirect URIs
5. Test if env var is accessible in browser

Let me know what you find and I'll help fix it! 🔧
