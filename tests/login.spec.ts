import { test, expect } from '@playwright/test';

test.skip('test', async ({ page }) => {
  await page.goto('http://10.0.0.167:5173/login');
  await page.getByRole('link', { name: 'Register New Account' }).click();

  await expect(page.getByRole('heading', { name: 'Registration' })).toBeVisible();
});
test.skip('test registration', async ({ page }) => {
  await page.goto('http://10.0.0.167:5173/login');
  await page.getByRole('link', { name: 'Register New Account' }).click();
  await page.getByPlaceholder('name@example.com').click();
  await page.getByPlaceholder('name@example.com').fill('test_john@no.com');
  await page.getByPlaceholder('name@example.com').press('Tab');
  await page.getByPlaceholder('Password').fill('insecure');
  const btnRegister = page.getByRole('button', { name: 'Register' });
  await btnRegister.click();
  // console.log(btnRegister);
  await expect(page.getByText(/User registered :true:/)).toBeVisible();
});

test('login registered user', async ({ page }) => {
  await page.goto('http://10.0.0.167:5173/login');
  await page.getByPlaceholder('name@example.com').click();
  await page.getByPlaceholder('name@example.com').fill('test_john@no.com');
  await page.getByPlaceholder('name@example.com').press('Tab');
  await page.getByPlaceholder('Password').fill('insecure');
  const btnLogin = page.getByRole('button', { name: 'Sign In' });
  await btnLogin.click();
})

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects the URL to contain intro.
//   await expect(page).toHaveURL(/.*intro/);
// });
