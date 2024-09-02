import { chromium, test, expect } from '@playwright/test';
const { exec } = require('child_process');
const path = require('path');

let webSocketUrl
let page

test.use({
    ignoreHTTPSErrors: true
})

test('New User Registration', async ({ request }) => {
    // Launch incognito chrome browser using COMMAND with preloaded URL
    const chromePath = path.join('C:', 'Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe');
    const url = 'https://devservices.peoriaaz.gov';
    const command = `"${chromePath}" --remote-debugging-port=9222 --incognito "${url}"`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error launching Chrome: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

    // Sync
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Get websocket URL
    try {
        const req = await request.get('http://localhost:9222/json/version')
        const response = await req.json()
        webSocketUrl = response.webSocketDebuggerUrl
    }
    catch (error) {
        throw new Error('Error Connecting : Currently no active Browser Session.')
    }

    // Connect to the browser using websocket URL
    const browser = await chromium.connectOverCDP(webSocketUrl)
    const contexts = browser.contexts()
    const pages = contexts[0].pages()
    page = pages[0]
    await page.bringToFront()

    //Sync
    await page.waitForLoadState("networkidle");

    // Handling Human verification
    if (await page.getByRole('heading', { name: 'Verify you are human by' }).isVisible()) {
        await expect(page.getByRole('heading', { name: 'Verify you are human by' }), 'Verify human verification exists').toBeVisible()
        await page.waitForTimeout(6000)
        const boundingBox = await page.locator('[class="spacer"]').boundingBox()
        const width = (boundingBox.height) / 2;
        await page.locator('[class="spacer"]').click({ position: { x: 30, y: width } })
    }
    // verify Peoriaaz Home page
    await expect(page.locator("//a[@title='Home']"), 'Verify Peoriaaz Home page').toBeVisible()

    // Click on Register for an account
    await page.getByRole('link', { name: 'Register for an Account', exact: true }).click()
    await page.getByLabel('I have read and accepted the').click()
    await page.getByRole('link', { name: 'Continue Registration »' }).click()

    // Generate New temporary MAil id with inbox using API call
    let newMailReq = await request.post('https://api.internal.temp-mail.io/api/v3/email/new')
    const newMailRes = await newMailReq.json()
    let mailId = newMailRes.email

    //Fill all the details for User Registratiion
    let randomNum = Math.floor(Math.random() * 90000) + 10000;
    await page.getByLabel('User Name:').fill('TestUser' + randomNum)
    await page.getByLabel('E-mail Address:').fill(mailId)
    await page.getByLabel('Password:').fill('TestUser@123')
    await page.getByLabel('Type Password Again:').fill('TestUser@123')
    await page.getByRole('textbox', { name: 'Enter Security Question:' }).fill('My favorite color?')
    await page.getByRole('textbox', { name: 'Answer: Required' }).fill('Blue')
    
    // Create and add a contact information
    await page.getByRole('link', { name: 'Add New' }).click()
    await expect(page.getByText('Select Contact Type')).toBeVisible()
    let frame = page.frameLocator('iframe[name="ACADialogFrame"]')
    await frame.getByLabel('Type:').selectOption('Contact')
    await frame.getByRole('link', { name: 'Continue' }).click()
    await frame.getByLabel('First:').fill('TestUser')
    await frame.getByLabel('Last:').fill('Automation')
    await frame.getByLabel('Address Line 1:').fill('Address Line 1')
    await frame.getByLabel('City:').fill('City')
    await frame.getByLabel('State:').selectOption('AK')
    await frame.getByLabel('Zip:').pressSequentially('123456789')
    await page.waitForTimeout(1000)
    await frame.getByLabel('Main Phone:').pressSequentially('1234567891')
    await frame.getByLabel('E-mail:').fill(mailId)
    await frame.getByRole('link', { name: 'Continue' }).click()
    await expect(page.getByLabel('Contact added successfully.'),'Verify contact information is added successfully').toBeVisible()
    await page.getByRole('link', { name: 'Continue Registration »' }).click()

    //Verify successfull Registration
    await expect(page.getByText('Your account is successfully')).toBeVisible()

    // Get Activation URL from the mail inbox
    let mailCount = 0
    let message
    while (mailCount == 0) {
        let emailReq = await request.get(`https://api.internal.temp-mail.io/api/v3/email/${mailId}/messages`)
        let eamilRes = await emailReq.json()
        mailCount = eamilRes.length
        if (eamilRes.length > 0) {
            message = eamilRes[0].body_text
        }
        await page.waitForTimeout(5000)
    }
    let confirmationMailURL = message.split('*')[1]

    // Launch the activation URL
    await page.goto(confirmationMailURL)

    await expect(page.locator("//span[contains(text(),'Your account has been verified')]"),'Verify Account is verified successfully').toBeVisible()

    //Login with the same user and password 
    await page.getByLabel('Password:').fill('TestUser@123')
    await page.getByRole('link', { name: 'Login »' }).click()

    // Verify TestUSer is logged in
    await expect(page.getByText('Hello, TestUser Automation'),'Verify logged in user').toBeVisible()

    //Logout of application
    await page.getByRole('link', { name: 'Logout' }).click()
    await expect(page.getByRole('link', { name: 'Register Now »' }),'Verify user is Logged out of application').toBeVisible()

    // Close the browser
    await page.close()
});