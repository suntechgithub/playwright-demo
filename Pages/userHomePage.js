import { expect } from '@playwright/test';

export class userHomePage {
    constructor(page) {
        this.page = page
        this.trustBrowser = page.getByRole('button', { name: 'Yes, Trust this Browser' })
        this.loggedUserName = page.getByRole('heading', { name: 'Welcome, Test1!' })
        this.userIcon = page.getByRole('button', { name: 'Test1', exact: true })
        this.logoutLink = page.getByRole('menuitem', { name: 'Log Out' })
    }

    async verifyUserLogin() {
        if (await this.trustBrowser.isVisible()) {
            await this.trustBrowser.click();
        }
        await this.page.waitForTimeout(2000);
        await expect(this.loggedUserName, 'Verify logged in user').toBeVisible();
    }

    async logOutOfApplication() {
        await this.userIcon.click();
        await expect(this.logoutLink, 'LogOut option').toBeVisible();
        await this.logoutLink.click();
    }
}