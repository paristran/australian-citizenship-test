# E2E Testing Guide

This project uses [Playwright](https://playwright.dev/) for end-to-end testing.

## Setup

1. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

2. **Create test user in Supabase:**
   - Go to Supabase Dashboard → Authentication → Users
   - Create a test user with email and password
   - Update `.env.test` with the credentials

3. **Create `.env.test` file:**
   ```bash
   cp .env.test.example .env.test
   ```
   Then fill in your test credentials.

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI (interactive mode)
npm run test:e2e:ui

# Run tests in debug mode (step through tests)
npm run test:e2e:debug

# View test report after running
npm run test:e2e:report
```

## Test Coverage

Current E2E tests cover:

- ✅ Guest navigation (Sign In/Sign Up buttons visible)
- ✅ Email/password login flow
- ✅ User dropdown appears after login
- ✅ Sign out flow
- ✅ Forgot password page
- ⏳ Google OAuth (requires test credentials)
- ⏳ Facebook OAuth (requires test credentials)

## Writing New Tests

Tests are located in the `e2e/` directory. Example:

```typescript
import { test, expect } from '@playwright/test'

test('my new test', async ({ page }) => {
  await page.goto('/')
  
  // Your test code here
  await expect(page.getByRole('heading')).toBeVisible()
})
```

## CI/CD Integration

To run tests in CI:

```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps chromium

- name: Run E2E tests
  run: npm run test:e2e
```

## Debugging Failed Tests

1. **View screenshots:** Check `test-results/` directory
2. **View videos:** Check `test-results/` for `.webm` files
3. **View traces:** Run `npm run test:e2e:report` to see detailed traces

## Best Practices

1. **Clear state before each test:** Tests should be independent
2. **Use data-testid attributes** for reliable selectors
3. **Avoid long waits:** Use Playwright's auto-waiting
4. **Test user interactions, not implementation details**
