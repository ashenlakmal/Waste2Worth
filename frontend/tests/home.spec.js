import { test, expect } from '@playwright/test';

test('Home page start journey button works', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    const startButton = page.getByText('Start Your Journey Now');

    await expect(startButton).toBeVisible();

    await startButton.click();

    await expect(page).toHaveURL(/.*BrowseListings/);
});