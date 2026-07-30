import { test, expect } from '@playwright/test';

test('User can login with valid credentials', async ({ page }) => {

    // 1. ඔයාගේ Login page එකට යනවා (ලින්ක් එක හරියටම දෙන්න)
    await page.goto('http://localhost:3000/login');

    // 2. Placeholder එකෙන් Email box එක හොයාගෙන email එක type කරනවා
    await page.getByPlaceholder('Email').fill('test@waste2worth.com');

    // 3. Placeholder එකෙන් Password box එක හොයාගෙන password එක type කරනවා
    await page.getByPlaceholder('Password').fill('123456');

    // 4. 'Login' කියන අකුරු තියෙන Button එක හොයාගෙන click කරනවා
    await page.getByRole('button', { name: 'Login' }).click();

    // 5. SweetAlert එකෙන් "Login Successful!" කියලා එනවද බලනවා
    const successMessage = page.getByText('Login Successful!');
    await expect(successMessage).toBeVisible();

    // 6. Login වුණාට පස්සේ Home page ("/") එකට යනවද කියලා බලනවා
    await expect(page).toHaveURL('http://localhost:3000/');
});