# Citizenship Practice App - Authentication & Progress Tracking

## 🚀 Features Added

### ✅ Authentication System
- Email + Password authentication
- Google OAuth integration
- Facebook OAuth integration
- Email verification
- Password reset (via Supabase)
- Session management
- Protected routes

### ✅ User Progress Tracking
- Save test results to database
- Track score history
- View progress dashboard
- Visual progress charts
- Recent test history
- Statistics (average score, highest score)

### ✅ User Profile Data
- Australian council selection
- Citizenship application date collection
- Profile completion flow
- Editable profile

---

## 📦 Installation

### 1. Install Dependencies

```bash
cd /Users/paris/.openclaw/workspace/citizenship-practice
npm install
```

### 2. Set Up Supabase

1. Create a Supabase project at https://supabase.com
2. Go to Settings > API and copy:
   - Project URL
   - Anon/Public Key
   - Service Role Key

3. Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Set Up Database

1. Go to Supabase Dashboard > SQL Editor
2. Run the SQL schema from `database/schema.sql`
3. This will create:
   - `user_profiles` table
   - `test_attempts` table
   - `test_answers` table
   - Row Level Security policies
   - Triggers for auto-profile creation

### 4. Configure OAuth (Optional)

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. In Supabase Dashboard > Authentication > Providers:
   - Enable Google
   - Add Client ID and Client Secret

#### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create a Facebook App
3. Add Facebook Login product
4. Add redirect URI: `https://your-project.supabase.co/auth/v1/callback`
5. In Supabase Dashboard > Authentication > Providers:
   - Enable Facebook
   - Add App ID and App Secret

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

---

## 🗂️ Project Structure

```
citizenship-practice/
├── app/
│   ├── api/
│   │   ├── test-attempts/route.ts     # Save/fetch test attempts
│   │   └── profile/route.ts            # User profile API
│   ├── login/page.tsx                  # Login page
│   ├── signup/page.tsx                 # Sign up page
│   ├── complete-profile/page.tsx       # Profile completion flow
│   ├── dashboard/page.tsx              # User dashboard
│   ├── providers.tsx                   # Auth provider wrapper
│   └── layout.tsx                      # Root layout
├── lib/
│   ├── auth/AuthProvider.tsx           # Authentication context
│   ├── supabase/
│   │   ├── client.ts                   # Browser client
│   │   └── server.ts                   # Server client
│   └── api/test.ts                     # API helper functions
├── types/
│   ├── database.ts                     # Supabase database types
│   ├── auth.ts                         # Auth-related types
│   └── tests.ts                        # Test-related types
├── database/
│   └── schema.sql                      # Database schema & RLS
├── middleware.ts                       # Auth middleware
└── .env.local.example                  # Environment variables template
```

---

## 🔐 Authentication Flow

### Sign Up Flow
1. User visits `/signup`
2. Enters name, email, password
3. Account created in Supabase Auth
4. `handle_new_user()` trigger creates profile automatically
5. User verifies email
6. Redirected to `/complete-profile` to finish setup
7. Redirected to `/dashboard`

### Login Flow
1. User visits `/login`
2. Enters email + password OR uses OAuth
3. Authenticated via Supabase
4. Redirected to `/dashboard`

### Protected Routes
- Middleware checks for valid session
- Unauthenticated users redirected to `/login`
- Session automatically refreshed

---

## 📊 Progress Tracking Integration

### Saving Test Results

The test page (`/test`) needs to be updated to save results. Here's how to integrate:

```typescript
import { saveTestAttempt } from '@/lib/api/test'
import { useAuth } from '@/lib/auth/AuthProvider'

// In your test completion handler:
const handleTestComplete = async () => {
  const { user } = useAuth()
  
  if (user) {
    // Only save if user is logged in
    await saveTestAttempt({
      score: correctAnswers,
      totalQuestions: 20,
      percentage: (correctAnswers / 20) * 100,
      timeSpentSeconds: 2700 - timeLeft,
      answers: testQuestions.map((q, i) => ({
        questionId: q.id,
        selectedAnswer: userAnswers[i],
        isCorrect: userAnswers[i] === q.correct
      }))
    })
  }
}
```

### Dashboard Features
- **Stats Cards**: Total tests, average score, highest score, readiness status
- **Progress Chart**: Line chart showing score over time (last 10 tests)
- **Recent Tests**: List of last 5 completed tests with scores
- **Quick Actions**: Links to practice test and study mode

---

## 🎨 UI/UX Features

- ✅ Apple/Tesla-inspired clean design
- ✅ Responsive (mobile-first)
- ✅ Loading states
- ✅ Error handling with toast notifications
- ✅ Smooth animations
- ✅ Consistent styling with existing app
- ✅ Australian green theme maintained

---

## 🧪 Testing the Features

### 1. Test Sign Up
```bash
# Visit
http://localhost:3000/signup

# Create account with:
- Name: Test User
- Email: test@example.com
- Password: password123
```

### 2. Check Database
```sql
-- In Supabase SQL Editor
SELECT * FROM user_profiles;
```

### 3. Complete Profile
```bash
# After signup, visit
http://localhost:3000/complete-profile

# Select council and date
```

### 4. Take Test
```bash
# Take a practice test
http://localhost:3000/test
```

### 5. View Dashboard
```bash
# See your progress
http://localhost:3000/dashboard
```

---

## 🔧 Next Steps

### Recommended Enhancements

1. **Update Test Page** (`/test/page.tsx`)
   - Add authentication check
   - Save test results to database
   - Show logged-in user prompt for guests

2. **Add Profile Page** (`/profile/page.tsx`)
   - Edit full name
   - Edit council/application date
   - View account details
   - Delete account option

3. **Add Forgot Password Page** (`/forgot-password/page.tsx`)
   - Use Supabase password reset
   - Email input form

4. **Add Leaderboard** (optional)
   - Public leaderboard
   - Council-specific rankings

5. **Add Achievements** (optional)
   - First test badge
   - 75% score achievement
   - Perfect score achievement
   - 10 tests completed

6. **Add Email Notifications** (optional)
   - Test reminders
   - Application date reminders
   - Weekly progress reports

---

## 📝 Environment Variables

Required in `.env.local`:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App (required)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Update OAuth Redirect URLs

After deployment, update OAuth redirect URLs:
- Google: `https://yourdomain.com/auth/callback`
- Facebook: `https://yourdomain.com/auth/callback`

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Authentication Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

---

## ✅ Implementation Checklist

- [x] Install dependencies
- [x] Create Supabase client configuration
- [x] Set up authentication context
- [x] Create database types
- [x] Create database schema
- [x] Create login page
- [x] Create signup page
- [x] Create profile completion page
- [x] Create dashboard page
- [x] Create test attempts API
- [x] Create profile API
- [ ] **Update test page to save results**
- [ ] Configure Google OAuth
- [ ] Configure Facebook OAuth
- [ ] Add forgot password page
- [ ] Add profile edit page
- [ ] Test all flows
- [ ] Deploy to production

---

## 🐛 Troubleshooting

### "Invalid API key" error
- Check `.env.local` has correct Supabase credentials
- Restart development server after adding env vars

### OAuth not working
- Verify redirect URLs match exactly
- Check OAuth credentials in Supabase dashboard

### Profile not created on signup
- Check database trigger exists
- Run `database/schema.sql` again

### Tests not saving
- Ensure user is authenticated
- Check API route logs
- Verify RLS policies are correct

---

**Built with ❤️ for aspiring Australian citizens**
