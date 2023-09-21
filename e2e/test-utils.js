import puppeteer from "puppeteer";
import { getDocument } from "pptr-testing-library";

export async function openWebBrowser(debugEnabled = false) {
    const launchOptions = debugEnabled
        ? {
            headless: false,
            slowMo: 50, // milliseconds
            defaultViewport: {
                width: 1280,
                height: 1280
            },
            args: ['--window-size=1280,1280']
        }
        : { headless: true }
    const browser = await puppeteer.launch(launchOptions);
    const tab = await browser.newPage();
    return { browser, tab }
}

export async function visitPage(currentTab, newUrl) {
    await currentTab.goto(newUrl);
    return await getDocument(currentTab);
}
