import {
    buyDisplayedProduct,
    checkout,
    continueShopping,
    displaysOrderConfirmation,
    displaysPageTitle,
    displaysPlatinumProductImage,
    displaysProductPrice,
    displaysProductTitle,
    displaysRecommendations,
    displaysShoppingCartTitle,
    displaysStandardProductImage,
    emptyShoppingCart,
    emptyShoppingCartIfNotEmpty,
    orderContainsItems,
    orderTotals,
    reviewShoppingCart,
    selectRecommendedProduct,
    shoppingCartContains,
    shoppingCartContainsItems,
    shoppingCartIsEmpty,
    shoppingCartTotals,
    switchToPlatinumEdition
} from "./storefront-dsl.js";
import { openWebBrowser, reloadPage, visitPage } from "./test-utils.js";
import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vitest";

describe("Customer Journey", () => {
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
        await reviewShoppingCart(document);
        await displaysShoppingCartTitle(document);
        await shoppingCartContainsItems(document, [
            { model: "Eicher Diesel 215/16", edition: "standard", price: "$58" },
        ]);
        await shoppingCartTotals(document, "$58");
        await continueShopping(document);
        await emptyShoppingCart(document);
        await shoppingCartIsEmpty(document);

        await buyDisplayedProduct(document);
        await selectRecommendedProduct(document, "Porsche-Diesel Master 419")
        await switchToPlatinumEdition(document);
        await buyDisplayedProduct(document);
        await shoppingCartContains(document, 2);
        await shoppingCartTotals(document, "$1024");

        await reviewShoppingCart(document);
        await shoppingCartContainsItems(document, [
            { model: "Eicher Diesel 215/16", edition: "standard", price: "$58" },
            { model: "Porsche-Diesel Master 419", edition: "platinum", price: "$966" },
        ]);
        await shoppingCartTotals(document, "$1024");
    });

    test("Checkout products in the shopping cart", async () => {
        await emptyShoppingCartIfNotEmpty(document);

        await buyDisplayedProduct(document);
        await reviewShoppingCart(document);
        await displaysShoppingCartTitle(document);
        await checkout(document);
        const firstOrderNumber = await displaysOrderConfirmation(document);
        await orderContainsItems(document, [
            { model: "Eicher Diesel 215/16", edition: "standard", price: "$58" }
        ]);
        await orderTotals(document, "$58")
        await continueShopping(document);
        await shoppingCartIsEmpty(document);

        await selectRecommendedProduct(document, "Porsche-Diesel Master 419")
        await buyDisplayedProduct(document);
        await selectRecommendedProduct(document, "Fendt F20 Dieselroß")
        await switchToPlatinumEdition(document);
        await buyDisplayedProduct(document);
        await checkout(document);
        const secondOrderNumber = await displaysOrderConfirmation(document);
        expect(secondOrderNumber).not.toEqual(firstOrderNumber);
        await orderContainsItems(document, [
            { model: "Fendt F20 Dieselroß", edition: "platinum", price: "$954" },
            { model: "Porsche-Diesel Master 419", edition: "standard", price: "$66" },
        ]);
        await orderTotals(document, "$1020")
    });

}, { timeout: 120_000 });

