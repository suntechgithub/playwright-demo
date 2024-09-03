import { humanVerificaionPage } from '../Pages/humanVerificationPage';
import { homePage } from '../Pages/homePage';
import { userLoginPage } from '../Pages/userLoginPage';
import { userHomePage } from '../Pages/userHomePage';

export class pomPage {
    constructor(page) {
        this.page = page
        this.humanVerificaionPage = new humanVerificaionPage(page)
        this.homePage = new homePage(page)
        this.userLoginPage = new userLoginPage(page)
        this.userHomePage = new userHomePage(page)
    }
}