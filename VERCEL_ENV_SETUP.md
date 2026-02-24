# Urgent: Update Vercel Environment Variable

## 🔧 Required Action

You need to add/update this environment variable in Vercel:

### Variable to Add:
```
NEXT_PUBLIC_APP_URL=https://www.getcitizenship.com.au
```

## 📝 Steps:

1. Go to **Vercel Dashboard**
2. Select your **citizenship-practice** project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `NEXT_PUBLIC_APP_URL`
   - **Value:** `https://www.getcitizenship.com.au`
   - **Environments:** Production, Preview, Development (all 3)
5. Click **Save**

6. **Important:** Redeploy for changes to take effect
   - Go to **Deployments**
   - Click **...** on latest deployment
   - Select **Redeploy**

## Why This Matters:

This fixes the OAuth redirect issue where Google/Facebook login redirects to `localhost:3000` instead of your production URL.

The auth flow now uses this variable:
```typescript
const redirectUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${redirectUrl}/auth/callback`
  }
})
```

## After Adding:

✅ Google OAuth will redirect to: `https://www.getcitizenship.com.au/auth/callback`
✅ Facebook OAuth will redirect to: `https://www.getcitizenship.com.au/auth/callback`
✅ No more localhost redirects on production!

## Current Deployment Status:

- ✅ Code pushed to GitHub (commit: 964c5d2)
- ⏳ Vercel auto-deploying
- ⚠️ **Need to add env var and redeploy**

---

Do this now and the OAuth login will work correctly! 🚀
