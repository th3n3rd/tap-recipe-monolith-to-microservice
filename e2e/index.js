import puppeteer from "puppeteer";
import { configure, getDocument } from "pptr-testing-library";
import {
    buyProduct,
    containsText,
    displayProductPrice,
    displaysPlatinumProductImage,
    displaysProductModel,
    displaysRecommendations,
    displaysStandardProductImage,
    emptyShoppingCart,
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

// global testing-library timeout
configure({
    asyncUtilTimeout: 3000
});

(async () => {
    const { browser, document } = await openWebapp(url);

    await containsText(document, /The Tractor Store/);
    await displaysProductModel(document, "Eicher Diesel 215/16");
    await displaysStandardProductImage(document, "Eicher Diesel 215/16");
    await displayProductPrice(document, "$58");

    await shoppingCartIsEmpty(document);
    await buyProduct(document);
    await shoppingCartContains(document, 1);
    await buyProduct(document);
    await shoppingCartContains(document, 2);
    await shoppingCartTotals(document, "$116");

    await switchToPlatinumEdition(document);
    await displaysPlatinumProductImage(document, "Eicher Diesel 215/16");
    await displayProductPrice(document, "$958");
    await buyProduct(document);
    await shoppingCartContains(document, 3);
    await shoppingCartTotals(document, "$1074");

    await emptyShoppingCart(document);
    await shoppingCartIsEmpty(document);

    await buyProduct(document);
    await shoppingCartContains(document, 1);
    await shoppingCartTotals(document, "$958");
    await emptyShoppingCart(document);

    await displaysRecommendations(document, [
        "Fendt F20 Dieselroß",
        "Porsche-Diesel Master 419"
    ]);

    await selectRecommendedProduct(document, "Porsche-Diesel Master 419")
    await displaysProductModel(document, "Porsche-Diesel Master 419");
    await displaysStandardProductImage(document, "Porsche-Diesel Master 419");
    await displayProductPrice(document, "$66");
    await displaysRecommendations(document, [
        "Fendt F20 Dieselroß",
        "Eicher Diesel 215/16"
    ]);

    await browser.close();
})();

async function openWebapp(pageUrl) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(pageUrl);
    const document = await getDocument(page);
    return { browser, document }
}

