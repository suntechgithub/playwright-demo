import {userLoginPage} from "./userLoginPage.js"
import {userHomePage} from "./userHomePage.js"

export class pomPage {
    constructor(page) {
        this.page = page
        this.userLoginPage = new userLoginPage(page)
        this.userHomePage = new userHomePage(page)
    }
}