import { expect } from '@playwright/test';
export class homePage {
    constructor(page) {
        this.page = page
        this.registerForAnAccountLink = page.getByRole('link', { name: 'Register for an Account', exact: true });
        this.iHaveReadAndAcceptedTheAboveTermsCheckbox = page.getByLabel('I have read and accepted the');
        this.continueRegistrationLink = page.getByRole('link', { name: 'Continue Registration »' })
        this.userNameTextField = page.getByLabel('User Name:')
        this.emailAddressTextField = page.getByLabel('E-mail Address:')
        this.passwordTextField = page.getByLabel('Password:')
        this.typePasswordAgainTextField = page.getByLabel('Type Password Again:')
        this.enterSecurityQuestionTextField = page.getByRole('textbox', { name: 'Enter Security Question:' })
        this.answerTextField = page.getByRole('textbox', { name: 'Answer: Required' })
        this.addNewLink = page.getByRole('link', { name: 'Add New' })
        this.contactFrame = page.frameLocator('iframe[name="ACADialogFrame"]');
        this.contactTypeDropdown = page.getByText('Select Contact Type')
        this.selectContactTypeDropdown = this.contactFrame.getByLabel('Type:')
        this.continueButton = this.contactFrame.getByRole('link', { name: 'Continue' })
        this.firstNameTextField = this.contactFrame.getByLabel('First:')
        this.lastNameTextField = this.contactFrame.getByLabel('Last:')
        this.addressLine1 = this.contactFrame.getByLabel('Address Line 1:')
        this.cityTextFIeld = this.contactFrame.getByLabel('City:')
        this.stateDropdown = this.contactFrame.getByLabel('State:')
        this.zipTextField = this.contactFrame.getByLabel('Zip:')
        this.mainPhoneNumberTextField = this.contactFrame.getByLabel('Main Phone:')
        this.mailIdTextField = this.contactFrame.getByLabel('E-mail:')
        this.contactAddedSuccessMessage = page.getByLabel('Contact added successfully.')
        this.accountRegistrationSuccessMessage=page.getByText('Your account is successfully')
    }

    async registerAnAccount() {
        await this.registerForAnAccountLink.click();
        await this.iHaveReadAndAcceptedTheAboveTermsCheckbox.click();
        await this.continueRegistrationLink.click();
    }

    async fillDetails(username, mailId, password, securityQuestion, answer) {
        await this.userNameTextField.fill(username);
        await this.emailAddressTextField.fill(mailId);
        await this.passwordTextField.fill(password);
        await this.typePasswordAgainTextField.fill(password);
        await this.enterSecurityQuestionTextField.fill(securityQuestion);
        await this.answerTextField.fill(answer);
    }

    async createContactInformation(firstName, lastName, addressLine1, city, zip, mainPhoneNumber, mailId) {
        await this.addNewLink.click();
        await expect(this.contactTypeDropdown).toBeVisible();
        await this.selectContactTypeDropdown.selectOption('Contact');
        await this.continueButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.firstNameTextField.fill(firstName);
        await this.lastNameTextField.fill(lastName);
        await this.addressLine1.fill(addressLine1);
        await this.cityTextFIeld.fill(city);
        await this.stateDropdown.selectOption('AK');
        await this.zipTextField.pressSequentially(zip,{delay:100});
        await this.page.waitForTimeout(2000);
        await this.mainPhoneNumberTextField.pressSequentially(mainPhoneNumber,{delay:100});
        await this.mailIdTextField.fill(mailId);
        await this.continueButton.click();
        await expect(this.contactAddedSuccessMessage, 'Verify contact information is added successfully').toBeVisible();
    }

    async clickOnContinueRegistration(){
        await this.continueRegistrationLink.click();
    }

    async verifyRegistration(){
        await expect(this.accountRegistrationSuccessMessage,'Verify new Account registration success message').toBeVisible();
    }
}