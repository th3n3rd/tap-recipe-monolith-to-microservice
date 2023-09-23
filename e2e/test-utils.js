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
            args: [
                '--window-size=1280,1280',
                '--disable-features=DialMediaRouteProvider' // prevent the annoying macOS chrome popup!
            ]
        }
        : { headless: true }
    return await puppeteer.launch(launchOptions);
}

export async function visitPage(currentTab, newUrl) {
    await currentTab.goto(newUrl);
    return await getDocument(currentTab);
}

export async function reloadPage(currentTab) {
    await currentTab.reload();
    return await getDocument(currentTab);
}
