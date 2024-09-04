import { expect } from '@playwright/test';

export class userHomePage {
    constructor(page) {
        this.page = page
        this.loggedUserName = page.getByText('Hello, TestUser Automation')
        this.logoutLink = page.getByRole('link', { name: 'Logout' })
        this.registerNowLink = page.getByRole('link', { name: 'Register Now »' })
        this.inavlidCredentialsErrorMessage = page.locator("//div[@id='messageSpanContent']")
    }

    async verifyUserLogin() {
        await this.page.waitForTimeout(5000);
        if (await this.inavlidCredentialsErrorMessage.count() > 0) {
            await this.page.close()
            throw new Error("Invalid Credentials")
        }
        await expect(this.loggedUserName, 'Verify logged in user').toBeVisible();
        let headings = ['Announcements', 'Collections (0)', 'Cart (0)', 'Account Management', 'Logout']
        for (let heading of headings) {
            await expect(this.page.getByRole('link', { name: heading })).toBeVisible();
        }
        await expect(this.page.getByText('Logged in as:')).toBeVisible()
    }

    async logOutOfApplication() {
        await this.logoutLink.click();
        await expect(this.registerNowLink, 'Verify user is Logged out of application').toBeVisible();
    }
}