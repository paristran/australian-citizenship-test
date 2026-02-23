# Integration Guide: Save Test Results

This guide shows you how to update the test page to save results to the database.

## Step 1: Add Auth Check to Test Page

Update `/app/test/page.tsx` to check if user is logged in:

```typescript
// Add at the top of the file
import { useAuth } from '@/lib/auth/AuthProvider'
import { saveTestAttempt } from '@/lib/api/test'
import { useRouter } from 'next/navigation'

// Inside the Test component
const { user } = useAuth()
const router = useRouter()
```

## Step 2: Update Test Completion Handler

Find the function that handles test completion and add saving logic:

```typescript
// In the Test component, update the completion logic
const completeTest = async () => {
  // Calculate time spent
  const timeSpent = 2700 - timeLeft // 2700 = 45 minutes in seconds
  
  // Calculate percentage
  const percentage = (score / 20) * 100
  
  // Prepare answers data
  const answersData = testQuestions.map((q, index) => ({
    questionId: q.id,
    selectedAnswer: selectedAnswers[index] || null,
    isCorrect: selectedAnswers[index] === q.correct
  }))
  
  // Save to database if user is logged in
  if (user) {
    try {
      await saveTestAttempt({
        score: score,
        totalQuestions: 20,
        percentage: percentage,
        timeSpentSeconds: timeSpent,
        answers: answersData
      })
      toast.success('Results saved! View your progress on the dashboard.')
    } catch (error) {
      console.error('Failed to save results:', error)
      toast.error('Failed to save results, but test completed successfully.')
    }
  }
  
  setTestComplete(true)
}
```

## Step 3: Add "View Progress" Button

Update the test completion screen to show a button to view progress:

```typescript
// In the test completion JSX, add after the results
{user && (
  <button
    onClick={() => router.push('/dashboard')}
    className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
  >
    📊 View Your Progress
  </button>
)}

{!user && (
  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
    <p className="text-sm text-blue-800">
      💡 <strong>Sign up</strong> to track your progress and see your improvement over time!
    </p>
    <Link
      href="/signup"
      className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
    >
      Create Free Account
    </Link>
  </div>
)}
```

## Step 4: Add Login Prompt for Guest Users

At the start of the test, show a message to non-logged-in users:

```typescript
// Add at the top of the test page, before "Start Test" button
{!user && !testStarted && (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
    <p className="text-sm text-yellow-800">
      ⚠️ You're taking this test as a guest. <Link href="/signup" className="underline font-semibold">Sign up</Link> or <Link href="/login" className="underline font-semibold">log in</Link> to track your progress and access personalized features.
    </p>
  </div>
)}
```

## Step 5: Track Selected Answers

Make sure you're tracking all selected answers throughout the test:

```typescript
// Add state to track all answers
const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])

// When user selects an answer
const selectAnswer = (index: number) => {
  if (showResult) return
  
  const newAnswers = [...selectedAnswers]
  newAnswers[currentIndex] = index
  setSelectedAnswers(newAnswers)
  setSelectedAnswer(index)
}
```

## Full Example

Here's a complete example of the updated test completion section:

```typescript
// Add these imports
import { useAuth } from '@/lib/auth/AuthProvider'
import { saveTestAttempt } from '@/lib/api/test'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function Test() {
  // ... existing state ...
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  
  const { user } = useAuth()
  const router = useRouter()
  
  // ... existing code ...
  
  const finishTest = async () => {
    if (!testComplete) return
    
    const timeSpent = 2700 - timeLeft
    const percentage = (score / 20) * 100
    
    const answersData = testQuestions.map((q, index) => ({
      questionId: q.id,
      selectedAnswer: selectedAnswers[index] ?? null,
      isCorrect: selectedAnswers[index] === q.correct
    }))
    
    if (user) {
      try {
        await saveTestAttempt({
          score,
          totalQuestions: 20,
          percentage,
          timeSpentSeconds: timeSpent,
          answers: answersData
        })
        toast.success('Progress saved!')
      } catch (error) {
        console.error('Save error:', error)
      }
    }
  }
  
  // Call finishTest when test completes
  useEffect(() => {
    if (testComplete) {
      finishTest()
    }
  }, [testComplete])
  
  // In the completion JSX
  return (
    <div>
      {/* ... existing results ... */}
      
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => {
            startTest()
            setSelectedAnswers([])
          }}
          className="btn btn-primary"
        >
          🔄 Take Another Test
        </button>
        
        {user && (
          <button
            onClick={() => router.push('/dashboard')}
            className="btn btn-secondary"
          >
            📊 View Progress Dashboard
          </button>
        )}
      </div>
      
      {!user && (
        <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 text-center">
          <p className="text-lg font-semibold mb-2">
            🎯 Track Your Progress
          </p>
          <p className="text-gray-600 mb-4">
            Sign up to save your results, track your improvement, and get personalized study recommendations.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      )}
    </div>
  )
}
```

## Testing the Integration

1. **As Guest User:**
   - Take test without logging in
   - See prompt to sign up at the end
   - No data saved to database

2. **As Logged-in User:**
   - Take test while logged in
   - Results automatically saved
   - See "View Progress" button
   - Check dashboard to see saved results

## Optional Enhancements

### Add "Save & Exit" Feature
Allow users to save incomplete tests and resume later:

```typescript
const saveAndExit = async () => {
  if (!user) return
  
  const answersData = testQuestions.slice(0, currentIndex).map((q, index) => ({
    questionId: q.id,
    selectedAnswer: selectedAnswers[index] ?? null,
    isCorrect: selectedAnswers[index] === q.correct
  }))
  
  await saveTestAttempt({
    score: score,
    totalQuestions: currentIndex + 1,
    percentage: (score / (currentIndex + 1)) * 100,
    timeSpentSeconds: 2700 - timeLeft,
    answers: answersData,
    status: 'in_progress' // Mark as incomplete
  })
  
  router.push('/dashboard')
}
```

### Show Previous High Score
Display user's best score before starting:

```typescript
const [highScore, setHighScore] = useState(0)

useEffect(() => {
  if (user) {
    fetch('/api/test-attempts?limit=1')
      .then(res => res.json())
      .then(data => {
        if (data.attempts && data.attempts.length > 0) {
          const maxScore = Math.max(...data.attempts.map((a: any) => a.percentage))
          setHighScore(maxScore)
        }
      })
  }
}, [user])

// In JSX
{user && highScore > 0 && (
  <div className="mb-4 text-center text-gray-600">
    🏆 Your highest score: {highScore.toFixed(1)}%
  </div>
)}
```

---

**That's it!** Your test results are now being saved and tracked.
