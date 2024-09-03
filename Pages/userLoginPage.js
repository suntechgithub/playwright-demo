import { expect } from '@playwright/test';

export class userLoginPage {
    constructor(page) {
        this.page = page
        this.verifyUserSuccessfullRegistrationMessage = page.locator("//span[contains(text(),'Your account has been verified')]")
        this.passwordTextField = page.getByLabel('Password:')
        this.loginLink = page.getByRole('link', { name: 'Login »' })
    }

    async verifyUserSuccessfullRegistration() {
        await expect(this.verifyUserSuccessfullRegistrationMessage, 'Verify Account is verified successfully').toBeVisible();
    }

    async loginToApplication(password) {
        await this.passwordTextField.fill(password);
        await this.loginLink.click();
        await this.page.waitForLoadState('networkidle')
    }
}