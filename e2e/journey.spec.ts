import { test, expect } from '@playwright/test'

test.describe('Citizenship Journey Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to page first, then clear auth state
    await page.goto('/')
    await page.context().clearCookies()
    await page.evaluate(() => {
      try {
        localStorage.clear()
        sessionStorage.clear()
      } catch (e) {
        // Ignore errors if storage is not accessible
      }
    })
  })

  test('should redirect to login if not authenticated', async ({ page }) => {
    await page.goto('/journey')
    
    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
  })

  // Note: To test authenticated flow, you need to:
  // 1. Create a test user in Supabase
  // 2. Set up test credentials in .env.test
  // 3. Use those credentials to login before testing journey page
})
