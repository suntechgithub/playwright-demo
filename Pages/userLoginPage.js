import { expect } from '@playwright/test';

export class userLoginPage {
    constructor(page) {
        this.page = page
       // this.verifyUserSuccessfullRegistrationMessage = page.locator("//span[contains(text(),'Your account has been verified')]")
        this.userNameField = page.getByRole('textbox', { name: 'Email', exact: true })
        this.passwordField = page.getByRole('textbox', { name: 'Password' })
        this.loginLink = page.getByRole('button', { name: 'Log In' })
    }

/*     async verifyUserSuccessfullRegistration() {
        await expect(this.verifyUserSuccessfullRegistrationMessage, 'Verify Account is verified successfully').toBeVisible();
    }

    async loginToApplicationWithOnlyPassword(password) {
        await this.passwordTextField.fill(password);
        await this.loginLink.click();
        await this.page.waitForLoadState('networkidle')
    } */
    async loginToApplication(username, password) {
        await this.userNameTextField.clear()
        await this.userNameTextField.fill(username)
        await this.passwordTextField.clear()
        await this.passwordTextField.fill(password);
        await this.loginLink.click();
        await this.page.waitForLoadState('networkidle')
    }
}