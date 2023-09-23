import { Storefront } from "./storefront-dsl.js";
import { openWebBrowser, reloadPage, visitPage } from "./test-utils.js";
import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vitest";

describe("Customer Journey", () => {
    let browser;
    let baseUrl;
    let debugEnabled;
    let storefront;

    beforeAll(async () => {
        baseUrl = process.env.APP_URL || "http://localhost:8080";
        debugEnabled = !!process.env.DEBUG_MODE;
        browser = await openWebBrowser(debugEnabled);
        storefront = new Storefront(await browser.newPage(), baseUrl);
    });

    beforeEach(async () => {
        await storefront.visitHomePage();
    });

    afterAll(async () => {
        await browser.close();
    });

    test("Displaying products and browsing recommendations", async () => {
        await storefront.displaysPageTitle(/The Tractor Store/);
        await storefront.displaysProductTitle("Eicher Diesel 215/16");
        await storefront.displaysStandardProductImage("Eicher Diesel 215/16");
        await storefront.displaysProductPrice("$58");
        await storefront.displaysRecommendations([
            "Fendt F20 Dieselroß",
            "Porsche-Diesel Master 419"
        ]);

        await storefront.switchToPlatinumEdition();
        await storefront.displaysPlatinumProductImage("Eicher Diesel 215/16");

        await storefront.selectRecommendedProduct("Porsche-Diesel Master 419")
        await storefront.displaysProductTitle("Porsche-Diesel Master 419");
        await storefront.displaysStandardProductImage("Porsche-Diesel Master 419");
        await storefront.displaysProductPrice("$66");
        await storefront.displaysRecommendations([
            "Fendt F20 Dieselroß",
            "Eicher Diesel 215/16"
        ]);

        await storefront.reloadPage();
        await storefront.displaysPageTitle(/The Tractor Store/);
        await storefront.displaysProductTitle("Porsche-Diesel Master 419");
    });

    test("Track products in the shopping cart", async () => {
        await storefront.emptyShoppingCartIfNotEmpty();

        await storefront.buyDisplayedProduct();
        await storefront.shoppingCartContains(1);
        await storefront.shoppingCartTotals("$58");
        await storefront.reviewShoppingCart();
        await storefront.displaysShoppingCartTitle();
        await storefront.shoppingCartContainsItems([
            { model: "Eicher Diesel 215/16", edition: "standard", price: "$58" },
        ]);
        await storefront.shoppingCartTotals("$58");
        await storefront.continueShopping();
        await storefront.emptyShoppingCart();
        await storefront.shoppingCartIsEmpty();

        await storefront.buyDisplayedProduct();
        await storefront.selectRecommendedProduct("Porsche-Diesel Master 419")
        await storefront.switchToPlatinumEdition();
        await storefront.buyDisplayedProduct();
        await storefront.shoppingCartContains(2);
        await storefront.shoppingCartTotals("$1024");

        await storefront.reviewShoppingCart();
        await storefront.shoppingCartContainsItems([
            { model: "Eicher Diesel 215/16", edition: "standard", price: "$58" },
            { model: "Porsche-Diesel Master 419", edition: "platinum", price: "$966" },
        ]);
        await storefront.shoppingCartTotals("$1024");
    });

    test("Checkout products in the shopping cart", async () => {
        await storefront.emptyShoppingCartIfNotEmpty();

        await storefront.buyDisplayedProduct();
        await storefront.reviewShoppingCart();
        await storefront.displaysShoppingCartTitle();
        await storefront.checkout();
        const firstOrderNumber = await storefront.displaysOrderConfirmation();
        await storefront.orderContainsItems([
            { model: "Eicher Diesel 215/16", edition: "standard", price: "$58" }
        ]);
        await storefront.orderTotals("$58")
        await storefront.continueShopping();
        await storefront.shoppingCartIsEmpty();

        await storefront.selectRecommendedProduct("Porsche-Diesel Master 419")
        await storefront.buyDisplayedProduct();
        await storefront.selectRecommendedProduct("Fendt F20 Dieselroß")
        await storefront.switchToPlatinumEdition();
        await storefront.buyDisplayedProduct();
        await storefront.checkout();
        const secondOrderNumber = await storefront.displaysOrderConfirmation();
        expect(secondOrderNumber).not.toEqual(firstOrderNumber);
        await storefront.orderContainsItems([
            { model: "Fendt F20 Dieselroß", edition: "platinum", price: "$954" },
            { model: "Porsche-Diesel Master 419", edition: "standard", price: "$66" },
        ]);
        await storefront.orderTotals("$1020")
    });

}, { timeout: 120_000 });

