# Supabase Configuration Guide for OAuth

## 🔧 CRITICAL: Configure Supabase URLs

The OAuth redirect issue is likely because Supabase doesn't know about your production URL.

### Step 1: Update Supabase Site URL

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Update these fields:

**Site URL:**
```
https://www.getcitizenship.com.au
```

**Redirect URLs** (add both):
```
http://localhost:3000/auth/callback
https://www.getcitizenship.com.au/auth/callback
```

5. Click **Save**

### Step 2: Verify Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your OAuth 2.0 Client ID
3. Click Edit (pencil icon)
4. Under **Authorized redirect URIs**, add:
```
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

Replace `YOUR_PROJECT_REF` with your Supabase project reference (the part before .supabase.co in your project URL)

5. Click **Save**

### Step 3: Get Your Supabase Project Reference

From your Supabase dashboard:
- Go to Settings → API
- Your URL looks like: `https://xyzabc123.supabase.co`
- The `xyzabc123` is your project reference

### Step 4: Test the Configuration

After updating:

1. Go to https://www.getcitizenship.com.au/login
2. Open browser console (F12 → Console tab)
3. Click "Continue with Google"
4. Check console output - should see:
   ```
   OAuth redirect URL: https://www.getcitizenship.com.au/auth/callback
   ```

If it still shows `localhost:3000`, then the env var is not set correctly in Vercel.

### Step 5: Verify Vercel Environment Variable

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Check that `NEXT_PUBLIC_APP_URL` exists
3. Value: `https://www.getcitizenship.com.au`
4. **Important:** Must be set for **Production** environment
5. After adding/editing, you MUST redeploy

### Quick Test

Visit your site and open console:
```javascript
console.log(process.env.NEXT_PUBLIC_APP_URL)
```

Should output: `https://www.getcitizenship.com.au`

If it outputs `undefined`, the env var is not configured correctly.

---

## Most Common Issues

1. ❌ **Supabase Site URL not updated** → Update it in Authentication → URL Configuration
2. ❌ **Google redirect URI missing** → Add to Google Cloud Console
3. ❌ **Not redeployed after env var change** → Redeploy in Vercel
4. ❌ **Env var only in Development** → Enable for Production too

---

Let me know once you've updated Supabase settings and I'll help you test! 🔧
