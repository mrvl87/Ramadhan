import { test, expect } from '@playwright/test';

const TIMESTAMP = Date.now();
const USER_EMAIL = `test.user.${TIMESTAMP}@example.com`;
const USER_PASSWORD = 'StrongPassword123!@#'; // Meets all criteria

test.describe('Authentication Flow', () => {

    test('should show validation error/warning for weak password on signup', async ({ page }) => {
        await page.goto('/signup');
        await page.fill('#fullName', 'Weak User');
        await page.fill('#age', '25');

        // Select Gender (Shadcn UI)
        await page.click('button[role="combobox"]');
        await page.getByRole('option', { name: 'Male' }).click();

        await page.fill('#email', `weak.${TIMESTAMP}@example.com`);

        // Type weak password
        await page.fill('#password', 'weak');

        // Verify the "Weak" text indicator appears
        await expect(page.getByText('Weak', { exact: true })).toBeVisible();

        // Try to submit
        await page.click('button[type="submit"]');

        // Expect to still be on the signup page (no redirect)
        await expect(page).toHaveURL('/signup');

        // Optional: Check for toast error if possible, but UI state (Weak label) is good enough
    });

    test('should successfully signup with valid credentials', async ({ page }) => {
        await page.goto('/signup');

        await page.fill('#fullName', 'Test User');
        await page.fill('#age', '30');

        // Select Gender
        await page.click('button[role="combobox"]');
        await page.getByRole('option', { name: 'Male' }).click();

        await page.fill('#email', USER_EMAIL);
        await page.fill('#password', USER_PASSWORD);

        // Verify "Strong" text indicator appears
        await expect(page.getByText('Strong', { exact: true })).toBeVisible();

        await page.click('button[type="submit"]');

        // Expect success card "Check your email"
        await expect(page.locator('h3', { hasText: 'Check your email' })).toBeVisible({ timeout: 10000 });
    });

    test('should show error for invalid login', async ({ page }) => {
        await page.goto('/login');
        await page.fill('#email', 'invalid@user.com');
        await page.fill('#password', 'wrongpass');
        await page.click('button[type="submit"]');

        // Expect error message in the red text div
        await expect(page.locator('.text-red-500')).toContainText('Invalid login credentials');
    });

    // Test with 'Unverified Email' logic
    // Note: We are reusing the user created above, which is essentially unverified in Supabase local (unless auto-confirm is on)
    test('should show verify email error for unverified account', async ({ page }) => {
        await page.goto('/login');
        await page.fill('#email', USER_EMAIL);
        await page.fill('#password', USER_PASSWORD);
        await page.click('button[type="submit"]');

        // The app uses toast.error for "Email not confirmed"
        // Playwright can detect the toast or we can check that we are NOT redirected
        // Let's check for the toast text availability in the DOM (Sonner usually renders it)
        await expect(page.getByText('Please verify your email address', { exact: false })).toBeVisible({ timeout: 10000 });
    });

    // Test Navbar state (Logged Out)
    test('should show Login button on Navbar when logged out', async ({ page }) => {
        await page.goto('/');

        // Check for Desktop Login Button
        // It is inside a Link to /login and has text "Login"
        const loginButton = page.locator('nav').getByRole('link', { name: 'Login' }).first();
        await expect(loginButton).toBeVisible();

        // Ensure "My Profile" is NOT visible
        await expect(page.getByText('My Profile')).not.toBeVisible();
    });

});
