import { expect } from '@playwright/test';

export class humanVerificaionPage {
    constructor(page) {
        this.page = page
        this.verifyHuman = page.getByRole('heading', { name: 'Verify you are human by' });
        this.veifyHumanCheckBox = page.locator('[class="spacer"]');
        this.homeTab = page.locator("//a[@title='Home']")
    }

    async isHumanVerificationPageVisible() {
        return await this.verifyHuman.count() > 0
    }

    async verifyYouAreHuman() {
        await expect(this.verifyHuman, 'Verify human verification exists').toBeVisible();
        await this.page.waitForTimeout(6000);
        const boundingBox = await this.veifyHumanCheckBox.boundingBox();
        const width = (boundingBox.height) / 2;
        await this.veifyHumanCheckBox.click({ position: { x: 30, y: width } });
        await this.page.waitForLoadState('networkidle');
        await expect(this.homeTab, 'Verify Peoriaaz Home page').toBeVisible();
    }

}