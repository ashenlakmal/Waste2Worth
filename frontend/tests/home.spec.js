import { test, expect } from '@playwright/test';

test('Home page start journey button works', async ({ page }) => {
    await page.goto('https://waste2-worth-40jn2me00-ashenlakmals-projects.vercel.app/');

    const startButton = page.getByText('Start Your Journey Now');

    await expect(startButton).toBeVisible();

    await startButton.click();

    await expect(page).toHaveURL(/.*BrowseListings/);
});