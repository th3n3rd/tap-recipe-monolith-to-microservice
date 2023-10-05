import { Customer } from "./customer-dsl.js";
import { openWebBrowser } from "./test-utils.js";
import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vitest";

describe("Customer Journeys", () => {
    let browser;
    let customer;

    beforeAll(async () => {
        const baseUrl = process.env.APP_URL || "http://localhost:8080";
        const debugEnabled = !!process.env.DEBUG_MODE;
        browser = await openWebBrowser(debugEnabled);
        customer = new Customer(await browser.newPage(), baseUrl);
    });

    beforeEach(async () => {
        await customer.visitHomePage();
    });

    afterAll(async () => {
        await browser.close();
    });

    test("Inspects products and browses recommendations", async () => {
        await customer.verifyPageTitle(/The Tractor Store/);
        await customer.verifyProductTitle("Eicher Diesel 215/16");
        await customer.verifyStandardProductImage("Eicher Diesel 215/16");
        await customer.verifyProductPrice("$58");
        await customer.verifyRecommendations([
            "Fendt F20 Dieselroß",
            "Porsche-Diesel Master 419"
        ]);

        await customer.switchToPlatinumEdition();
        await customer.verifyPlatinumProductImage("Eicher Diesel 215/16");

        await customer.selectRecommendedProduct("Porsche-Diesel Master 419")
        await customer.verifyProductTitle("Porsche-Diesel Master 419");
        await customer.verifyStandardProductImage("Porsche-Diesel Master 419");
        await customer.verifyProductPrice("$66");
        await customer.verifyRecommendations([
            "Fendt F20 Dieselroß",
            "Eicher Diesel 215/16"
        ]);

        await customer.reloadPage();
        await customer.verifyPageTitle(/The Tractor Store/);
        await customer.verifyProductTitle("Porsche-Diesel Master 419");
    });

    test("Moves items in and out the shopping cart", async () => {
        await customer.emptyShoppingCartIfNotEmpty();

        await customer.buyDisplayedProduct();
        await customer.verifyShoppingCartContains(1);
        await customer.verifyShoppingCartTotals("$58");
        await customer.reviewShoppingCart();
        await customer.verifyShoppingCartTitle();
        await customer.verifyShoppingCartContainsItems([
            { model: "Eicher Diesel 215/16", edition: "standard", price: "$58" },
        ]);
        await customer.verifyShoppingCartTotals("$58");
        await customer.continueShopping();
        await customer.emptyShoppingCart();
        await customer.verifyShoppingCartIsEmpty();

        await customer.buyDisplayedProduct();
        await customer.selectRecommendedProduct("Porsche-Diesel Master 419")
        await customer.switchToPlatinumEdition();
        await customer.buyDisplayedProduct();
        await customer.verifyShoppingCartContains(2);
        await customer.verifyShoppingCartTotals("$1024");

        await customer.reviewShoppingCart();
        await customer.verifyShoppingCartContainsItems([
            { model: "Eicher Diesel 215/16", edition: "standard", price: "$58" },
            { model: "Porsche-Diesel Master 419", edition: "platinum", price: "$966" },
        ]);
        await customer.verifyShoppingCartTotals("$1024");
    });

    test("Goes through the checkout process", async () => {
        await customer.emptyShoppingCartIfNotEmpty();

        await customer.buyDisplayedProduct();
        await customer.reviewShoppingCart();
        await customer.verifyShoppingCartTitle();
        await customer.checkout();
        await customer.decideToPayOverThePhone();
        const firstOrderNumber = await customer.verifyOrderIsConfirmed();
        await customer.verifyOrderContainsItems([
            { model: "Eicher Diesel 215/16", edition: "standard", price: "$58" }
        ]);
        await customer.verifyOrderTotals("$58")
        await customer.continueShopping();
        await customer.verifyShoppingCartIsEmpty();

        await customer.selectRecommendedProduct("Porsche-Diesel Master 419")
        await customer.buyDisplayedProduct();
        await customer.selectRecommendedProduct("Fendt F20 Dieselroß")
        await customer.switchToPlatinumEdition();
        await customer.buyDisplayedProduct();
        await customer.checkout();
        await customer.decideToPayOverThePhone();
        const secondOrderNumber = await customer.verifyOrderIsConfirmed();
        expect(secondOrderNumber).not.toEqual(firstOrderNumber);
        await customer.verifyOrderContainsItems([
            { model: "Fendt F20 Dieselroß", edition: "platinum", price: "$954" },
            { model: "Porsche-Diesel Master 419", edition: "standard", price: "$66" },
        ]);
        await customer.verifyOrderTotals("$1020")
    });

}, { timeout: 120_000 });

