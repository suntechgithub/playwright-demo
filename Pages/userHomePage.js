import { expect } from '@playwright/test';

export class userHomePage {
    constructor(page) {
        this.page = page
        this.loggedUserName = page.getByText('Hello, TestUser Automation')
        this.logoutLink = page.getByRole('link', { name: 'Logout' })
        this.registerNowLink = page.getByRole('link', { name: 'Register Now »' })
        this.inavlidCredentialsErrorMessage= page.locator("//div[@id='messageSpanContent']")
    }

    async verifyUserLogin() {
        await this.page.waitForTimeout(5000);
        if(await this.inavlidCredentialsErrorMessage.count() > 0){
            await this.page.close()
            throw new Error("Invalid Credentials")
        }
        await expect(this.loggedUserName, 'Verify logged in user').toBeVisible();
    }

    async logOutOfApplication() {
        await this.logoutLink.click();
        await expect(this.registerNowLink, 'Verify user is Logged out of application').toBeVisible();
    }

}