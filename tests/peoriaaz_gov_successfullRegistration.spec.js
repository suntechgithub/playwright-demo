import { test } from '@playwright/test';
import testData from '../testData/testData.json'
import { utils } from '../utilities/utils';
import { pomPage } from '../Pages/pomPage';

test.only('New User successfull Registration', async () => {
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

    //Verify Accela Citizen Access home page
    await pomManager.homePage.verifyHomePage()

    // Click on Register for an account
    await pomManager.homePage.registerAnAccount()

    // Generate New temporary MAil id with inbox using API call
    let mailId = await utils.generateMailId();

    // Verify all the fields to be filled
    await pomManager.homePage.verifyLoginInformationFields();

    //Fill all the details for User Registratiion
    let userName = testData.Username + (Math.floor(Math.random() * 90000) + 10000);
    await pomManager.homePage.fillDetails(userName, mailId, testData.password, testData.securityQuestion, testData.answer)

    // Create and add a contact information

    await pomManager.homePage.createContactInformation(testData.firstName, testData.lastName, testData.addressLine1, testData.city, testData.zip, testData.mainPhoneNumber, mailId)

    //Continue to register
    await pomManager.homePage.clickOnContinueRegistration()

    //Verify successfull Registration
    await pomManager.homePage.verifyRegistration()

    // Get Activation URL from the mail inbox
    let confirmationMailURL = await utils.getActivationUrl(mailId);

    // Launch the activation URL
    await page.goto(confirmationMailURL);

    //Verify new user successfull registration
    await pomManager.userLoginPage.verifyUserSuccessfullRegistration()

    //Login with the same user and password 
    await pomManager.userLoginPage.loginToApplication(userName, testData.password)

    // Verify TestUser is logged in
    await pomManager.userHomePage.verifyUserLogin()

    //Logout of application
    await pomManager.userHomePage.logOutOfApplication()

    // Close the browser
    await page.close();
});