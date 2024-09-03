import { request, chromium } from '@playwright/test';
const { exec } = require('child_process');
const path = require('path');

export class utils {
    static async launchLocalBrowserWithURL(URL) {
        const chromePath = path.join('C:', 'Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe');
        const url = URL;
        const command = `"${chromePath}" --remote-debugging-port=9222 --incognito "${URL}"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error launching Chrome: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    }

    static async setTimeout(time) {
        await new Promise(resolve => setTimeout(resolve, time * 1000));
    }

    static async getWebsocketUrl() {
        try {
            const req = await (await request.newContext({ ignoreHTTPSErrors: true })).get('http://localhost:9222/json/version');
            const response = await req.json();
            return response.webSocketDebuggerUrl;
        }
        catch (error) {
            throw new Error(error);
        }
    }

    static async connectToExistingBrowser(webSocketUrl) {
        const browser = await chromium.connectOverCDP(webSocketUrl);
        const contexts = browser.contexts();
        const pages = contexts[0].pages();
        let page = pages[0];
        await page.bringToFront();
        return page;
    }

    static async generateMailId() {
        let newMailReq = await (await request.newContext({ ignoreHTTPSErrors: true })).post('https://api.internal.temp-mail.io/api/v3/email/new');
        const newMailRes = await newMailReq.json();
        return newMailRes.email;
    }

    static async getActivationUrl(mailId) {
        let mailCount = 0;
        let message;
        while (mailCount == 0) {
            let emailReq = await (await request.newContext({ ignoreHTTPSErrors: true })).get(`https://api.internal.temp-mail.io/api/v3/email/${mailId}/messages`);
            let eamilRes = await emailReq.json();
            mailCount = eamilRes.length;
            if (eamilRes.length > 0) {
                message = eamilRes[0].body_text;
            }
            await this.setTimeout(5);
        }
        return message.split('*')[1];
    }
}