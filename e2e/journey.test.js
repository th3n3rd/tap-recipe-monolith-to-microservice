import {
    buyDisplayedProduct,
    checkout,
    continueShopping,
    displaysProductPrice,
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
    switchToPlatinumEdition, orderTotals
} from "./dsl.js";
import { openWebBrowser, visitPage } from "./test-utils.js";
import { describe, test, beforeAll, afterAll, expect } from "vitest";

describe("Store", () => {
    let session;
    let url;
    let debugEnabled;

    beforeAll(async () => {
        url = process.env.APP_URL || "http://localhost:8080";
        debugEnabled = !!process.env.DEBUG_MODE;
        session = await openWebBrowser(debugEnabled);
    });

    afterAll(async () => {
        await session.browser.close();
    });

    test("Customer journey", async () => {
        let document = await visitPage(session.tab, url);

        await emptyShoppingCartIfNotEmpty(document);

        await displaysPageTitle(document, /The Tractor Store/);
        await displaysProductTitle(document, "Eicher Diesel 215/16");
        await displaysStandardProductImage(document, "Eicher Diesel 215/16");
        await displaysProductPrice(document, "$58");

        await shoppingCartIsEmpty(document);
        await buyDisplayedProduct(document);
        await shoppingCartContains(document, 1);
        await buyDisplayedProduct(document);
        await shoppingCartContains(document, 2);
        await shoppingCartTotals(document, "$116");

        await switchToPlatinumEdition(document);
        await displaysPlatinumProductImage(document, "Eicher Diesel 215/16");
        await displaysProductPrice(document, "$958");
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
        await displaysProductPrice(document, "$66");
        await displaysRecommendations(document, [
            "Fendt F20 Dieselroß",
            "Eicher Diesel 215/16"
        ]);

        document = await visitPage(session.tab, `${url}/products/fendt?edition=platinum`)
        await displaysProductTitle(document, "Fendt F20 Dieselroß");
        await displaysPlatinumProductImage(document, "Fendt F20 Dieselroß");

        await buyDisplayedProduct(document);
        await checkout(document);
        const firstOrderNumber = await displaysOrderConfirmation(document);
        await continueShopping(document);
        await displaysProductTitle(document, "Eicher Diesel 215/16");
        await shoppingCartIsEmpty(document);

        await buyDisplayedProduct(document);
        await shoppingCartTotals(document, "$58");
        await buyDisplayedProduct(document);
        await checkout(document);
        const secondOrderNumber = await displaysOrderConfirmation(document);
        expect(secondOrderNumber).not.toEqual(firstOrderNumber);
        await orderTotals(document, "$116")
        await continueShopping(document);
    });

}, { timeout: 120_000 });

