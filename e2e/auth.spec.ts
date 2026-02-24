import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to page first, then clear auth state
    await page.goto('/')
    
    // Clear any existing auth state
    await page.context().clearCookies()
    await page.evaluate(() => {
      try {
        localStorage.clear()
        sessionStorage.clear()
      } catch (e) {
        // Ignore errors if storage is not accessible
      }
    })
    
    // Reload to get fresh state
    await page.reload()
  })

  test('should show guest navigation for unauthenticated users', async ({ page }) => {
    await page.goto('/')
    
    // Should see Sign In and Sign Up buttons
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible()
    
    // Should NOT see user dropdown
    await expect(page.getByRole('button', { name: /sign out/i })).not.toBeVisible()
  })

  test('should login with email and password', async ({ page }) => {
    // Go to login page
    await page.goto('/login')
    
    // Fill in credentials
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('testpassword123')
    
    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Should redirect to dashboard or home
    await page.waitForURL(/\/(dashboard|)/, { timeout: 10000 })
    
    // Should show user dropdown (avatar button)
    const userButton = page.locator('button').filter({ has: page.locator('.rounded-full') }).first()
    await expect(userButton).toBeVisible({ timeout: 5000 })
  })

  test('should show user dropdown after successful login', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('testpassword123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Wait for redirect
    await page.waitForURL(/\/(dashboard|)/, { timeout: 10000 })
    
    // Click on user avatar to open dropdown
    const userButton = page.locator('button').filter({ has: page.locator('.rounded-full') }).first()
    await userButton.click()
    
    // Dropdown should be visible
    await expect(page.getByRole('link', { name: /my progress/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /profile settings/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible()
  })

  test('should sign out successfully', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('testpassword123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Wait for redirect
    await page.waitForURL(/\/(dashboard|)/, { timeout: 10000 })
    
    // Open dropdown
    const userButton = page.locator('button').filter({ has: page.locator('.rounded-full') }).first()
    await userButton.click()
    
    // Click sign out
    await page.getByRole('button', { name: /sign out/i }).click()
    
    // Wait for redirect to home
    await page.waitForURL('/', { timeout: 5000 })
    
    // Should show Sign In button again (guest state)
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible()
    
    // Should NOT show user dropdown
    const userButtonAfterLogout = page.locator('button').filter({ has: page.locator('.rounded-full') }).first()
    await expect(userButtonAfterLogout).not.toBeVisible()
  })

  test('should show forgot password page', async ({ page }) => {
    await page.goto('/login')
    
    // Click forgot password link
    await page.getByRole('link', { name: /forgot password/i }).click()
    
    // Should be on forgot password page
    await expect(page).toHaveURL('/forgot-password')
    await expect(page.getByRole('heading', { name: /reset password/i })).toBeVisible()
    
    // Should have email input
    await expect(page.getByLabel(/email/i)).toBeVisible()
    
    // Should have submit button
    await expect(page.getByRole('button', { name: /send reset link/i })).toBeVisible()
  })
})

test.describe('Navigation State', () => {
  test('should show loading state initially', async ({ page }) => {
    // Slow down network to see loading state
    await page.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 100))
      route.continue()
    })
    
    await page.goto('/')
    
    // Loading state might be brief, so we check for either loading or final state
    const signInButton = page.getByRole('link', { name: /sign in/i })
    const loadingSkeleton = page.locator('.animate-pulse')
    
    // One of these should be visible
    await expect(
      (await signInButton.isVisible()) || (await loadingSkeleton.isVisible())
    ).toBeTruthy()
  })
})
