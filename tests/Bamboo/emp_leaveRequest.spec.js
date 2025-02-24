// Test for Requesting leave through Bamboo HR
import { test, expect } from '@playwright/test';

const testData = require('/Git/playwright-demo-bamboo/testData/testData.json');

test('Employee Logs in and Submits Leave request', async ({ page }) => {

    await page.goto('https://SunTech.bamboohr.com');
    await page.getByRole('textbox', { name: 'Email', exact: true }).fill(testData.EmployeeUsername);
    await page.getByRole('textbox', { name: 'Password' }).fill(testData.password);
    await page.getByRole('button', { name: 'Log In' }).click();
    
    //Trust the browser
    await page.getByRole('button', { name: 'Yes, Trust this Browser' }).click();

    //Verify User logged in Successfully
    await page.waitForLoadState("networkidle")
    await expect(page.getByRole('heading', { name: 'Welcome, Test1!' })).toBeVisible();
    
    // Request Time Off 
    await page.getByRole('heading', { name: 'Time Off' }).scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Request Time Off', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Request Time Off' })).toBeVisible();
    await page.getByRole('textbox', { name: 'From' }).fill('03/11/2025');
    await page.getByRole('textbox', { name: 'To' }).fill('03/11/2025');
    await page.getByRole('button', { name: 'Time Off Category –Select–' }).click();
    await page.getByText('Vacation').click();

    // Wait for the Amount field to be visible and verify its value
    await page.waitForTimeout(5000)
    const amountField = (await page.waitForSelector('//input[@aria-label="amount"]'));
    const amountValue = await amountField.inputValue();
    expect(amountValue).toBe('8');
    await page.waitForTimeout(5000)
    await page.getByRole('button', { name: 'Send Request' }).scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Send Request' }).click();

    
    //Logout of the application
    await page.getByRole('button', { name: 'Test1', exact: true }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Test1', exact: true }).click();
    await expect(page.getByRole('menuitem', { name: 'Log Out' })).toBeVisible();
    await page.getByRole('menuitem', { name: 'Log Out' }).click();
    await page.close();

});

test('Manager Logs in and Approves/Rejects Leave request', async ({ page }) => {

    await page.goto('https://SunTech.bamboohr.com');
    await page.getByRole('textbox', { name: 'Email', exact: true }).fill(testData.ManagerUsername);
    await page.getByRole('textbox', { name: 'Password' }).fill(testData.password);
    await page.getByRole('button', { name: 'Log In' }).click();
    
    //Trust the browser
    await page.getByRole('button', { name: 'Yes, Trust this Browser' }).click();

    //Verify Manager logged in Successfully
    await page.waitForLoadState("networkidle")
    await expect(page.getByRole('heading', { name: 'Welcome, Manager QA!' })).toBeVisible();
    
    // Approve/Reject Time Off 
    await page.getByRole('heading', { name: 'What\'s happening at SunTech' }).scrollIntoViewIfNeeded();
    await page.getByRole('link', { name: /Test1 QA/ }).first().hover();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Approve', exact: true }).click();

    //Verify that Time Off Request pop up is visible
    await expect (page.getByText(/Time off request/)).toBeVisible();
    
    //Logout of the application
    await page.getByRole('button', { name: 'Manager QA' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByRole('menuitem', { name: 'Log Out' })).toBeVisible();
    await page.getByRole('menuitem', { name: 'Log Out' }).click();
    await page.close();

});

