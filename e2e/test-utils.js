import puppeteer from "puppeteer";

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
        : {
            headless: "new",
            args: [
                '--disable-features=DialMediaRouteProvider' // prevent the annoying macOS chrome popup!
            ]
        }
    return await puppeteer.launch(launchOptions);
}
