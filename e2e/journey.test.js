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
    switchToPlatinumEdition,
    orderTotals,
    orderContainsItems
} from "./dsl.js";
import { openWebBrowser, reloadPage, visitPage } from "./test-utils.js";
import { describe, test, beforeAll, afterAll, beforeEach, expect } from "vitest";

describe("Store", () => {
    let session;
    let document;
    let url;
    let debugEnabled;

    beforeAll(async () => {
        url = process.env.APP_URL || "http://localhost:8080";
        debugEnabled = !!process.env.DEBUG_MODE;
        session = await openWebBrowser(debugEnabled);
    });

    beforeEach(async () => {
        document = await visitPage(session.tab, url);
    })

    afterAll(async () => {
        await session.browser.close();
    });

    test("Displaying products and browsing recommendations", async () => {
        await displaysPageTitle(document, /The Tractor Store/);
        await displaysProductTitle(document, "Eicher Diesel 215/16");
        await displaysStandardProductImage(document, "Eicher Diesel 215/16");
        await displaysProductPrice(document, "$58");
        await displaysRecommendations(document, [
            "Fendt F20 Dieselroß",
            "Porsche-Diesel Master 419"
        ]);

        await switchToPlatinumEdition(document);
        await displaysPlatinumProductImage(document, "Eicher Diesel 215/16");

        await selectRecommendedProduct(document, "Porsche-Diesel Master 419")
        await displaysProductTitle(document, "Porsche-Diesel Master 419");
        await displaysStandardProductImage(document, "Porsche-Diesel Master 419");
        await displaysProductPrice(document, "$66");
        await displaysRecommendations(document, [
            "Fendt F20 Dieselroß",
            "Eicher Diesel 215/16"
        ]);

        document = await reloadPage(session.tab);
        await displaysPageTitle(document, /The Tractor Store/);
        await displaysProductTitle(document, "Porsche-Diesel Master 419");
    });

    test("Track products in the shopping cart", async () => {
        await emptyShoppingCartIfNotEmpty(document);

        await buyDisplayedProduct(document);
        await shoppingCartContains(document, 1);
        await shoppingCartTotals(document, "$58");
        await emptyShoppingCart(document);
        await shoppingCartIsEmpty(document);

        await buyDisplayedProduct(document);
        await selectRecommendedProduct(document, "Porsche-Diesel Master 419")
        await switchToPlatinumEdition(document);
        await buyDisplayedProduct(document);
        await shoppingCartContains(document, 2);
        await shoppingCartTotals(document, "$1024");
    });

    test("Checkout products in the shopping cart", async () => {
        await emptyShoppingCartIfNotEmpty(document);

        await buyDisplayedProduct(document);
        await checkout(document);
        const firstOrderNumber = await displaysOrderConfirmation(document);
        await orderContainsItems(document, [
            { name: "Eicher Diesel 215/16", price: "$58" }
        ]);
        await orderTotals(document, "$58")
        await continueShopping(document);
        await shoppingCartIsEmpty(document);

        await selectRecommendedProduct(document, "Porsche-Diesel Master 419")
        await buyDisplayedProduct(document);
        await selectRecommendedProduct(document, "Fendt F20 Dieselroß")
        await buyDisplayedProduct(document);
        await checkout(document);
        const secondOrderNumber = await displaysOrderConfirmation(document);
        expect(secondOrderNumber).not.toEqual(firstOrderNumber);
        await orderContainsItems(document, [
            { name: "Fendt F20 Dieselroß", price: "$54" },
            { name: "Porsche-Diesel Master 419", price: "$66" },
        ]);
        await orderTotals(document, "$120")
    });

}, { timeout: 120_000 });

