import { test } from '@playwright/test';
import testData from '../testData/testData.json'
import { utils } from '../utilities/utils';
import { pomPage } from '../Pages/pomPage';

test('Failed Login Attempt with Incorrect Credentials', async () => {
    // Launch incognito chrome browser using COMMAND with preloaded URL
    await utils.launchLocalBrowserWithURL(testData.AppUrl)

    // Sync
    await utils.setTimeout(10)

    // Get websocket URL
    let webSocketUrl = await utils.getWebsocketUrl()

    // Connect to the browser using websocket URL
    let page = await utils.connectToExistingBrowser(webSocketUrl)
    const pomManager = new pomPage(page)
    //Sync
    await page.waitForLoadState("networkidle");

    // Handling Human verification
    if (await pomManager.humanVerificaionPage.isHumanVerificationPageVisible()) {
        await pomManager.humanVerificaionPage.verifyYouAreHuman()
    }

    //Login with the same user and password 
    await pomManager.userLoginPage.loginToApplication('a6neqzg3@tippabble.com', 'Invalid Password')

    // Verify TestUser is logged in
    await pomManager.userHomePage.verifyUserLogin()

    //Logout of application
    await pomManager.userHomePage.logOutOfApplication()

    // Close the browser
    await page.close();
});