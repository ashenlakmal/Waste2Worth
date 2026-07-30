import { test, expect } from '@playwright/test';

test('User can login with valid credentials', async ({ page }) => {

    await page.goto('https://waste2-worth-40jn2me00-ashenlakmals-projects.vercel.app/login');

    await page.getByPlaceholder('Email').fill('test@waste2worth.com');

    await page.getByPlaceholder('Password').fill('123456');

    await page.getByRole('button', { name: 'Login' }).click();

    const successMessage = page.getByText('Login Successful!');
    await expect(successMessage).toBeVisible();

    await expect(page).toHaveURL('https://waste2-worth-40jn2me00-ashenlakmals-projects.vercel.app/');
});