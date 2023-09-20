import puppeteer from "puppeteer";
import { getDocument } from "pptr-testing-library";
import {
    buyDisplayedProduct,
    checkout,
    continueShopping,
    displayProductPrice,
    displaysOrderConfirmation,
    displaysPageTitle,
    displaysPlatinumProductImage,
    displaysProductTitle,
    displaysRecommendations,
    displaysStandardProductImage,
    emptyShoppingCart,
    emptyShoppingCartIfNotEmpty,
    selectRecommendedProduct,
    shoppingCartContains,
    shoppingCartIsEmpty,
    shoppingCartTotals,
    switchToPlatinumEdition
} from "./dsl.js";

const url = process.argv[2];
if (!url) {
    console.error('Please provide a URL as the first parameter.');
    process.exit(1);
}

const debugEnabled = process.argv.includes("--debug");

async function openWebBrowser(debugEnabled = false) {
    const launchOptions = debugEnabled
        ? {
            headless: false,
            slowMo: 0.25,
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

async function visitPage(currentTab, newUrl) {
    await currentTab.goto(newUrl);
    return await getDocument(currentTab);
}

(async function journeyTest() {
    const { browser, tab } = await openWebBrowser(debugEnabled);

    let document = await visitPage(tab, url);

    await emptyShoppingCartIfNotEmpty(document);

    await displaysPageTitle(document, /The Tractor Store/);
    await displaysProductTitle(document, "Eicher Diesel 215/16");
    await displaysStandardProductImage(document, "Eicher Diesel 215/16");
    await displayProductPrice(document, "$58");

    await shoppingCartIsEmpty(document);
    await buyDisplayedProduct(document);
    await shoppingCartContains(document, 1);
    await buyDisplayedProduct(document);
    await shoppingCartContains(document, 2);
    await shoppingCartTotals(document, "$116");

    await switchToPlatinumEdition(document);
    await displaysPlatinumProductImage(document, "Eicher Diesel 215/16");
    await displayProductPrice(document, "$958");
    await buyDisplayedProduct(document);
    await shoppingCartContains(document, 3);
    await shoppingCartTotals(document, "$1074");

    await emptyShoppingCart(document);
    await shoppingCartIsEmpty(document);

    await buyDisplayedProduct(document);
    await shoppingCartContains(document, 1);
    await shoppingCartTotals(document, "$958");
    await emptyShoppingCart(document);

    await displaysRecommendations(document, [
        "Fendt F20 Dieselroß",
        "Porsche-Diesel Master 419"
    ]);

    await selectRecommendedProduct(document, "Porsche-Diesel Master 419")
    await displaysProductTitle(document, "Porsche-Diesel Master 419");
    await displaysStandardProductImage(document, "Porsche-Diesel Master 419");
    await displayProductPrice(document, "$66");
    await displaysRecommendations(document, [
        "Fendt F20 Dieselroß",
        "Eicher Diesel 215/16"
    ]);

    document = await visitPage(tab, `${url}/products/fendt?edition=platinum`)
    await displaysProductTitle(document, "Fendt F20 Dieselroß");
    await displaysPlatinumProductImage(document, "Fendt F20 Dieselroß");

    await buyDisplayedProduct(document);
    await checkout(document);
    await displaysOrderConfirmation(document);
    await continueShopping(document)
    await displaysProductTitle(document, "Eicher Diesel 215/16");
    await shoppingCartIsEmpty(document);

    await browser.close();
})();

