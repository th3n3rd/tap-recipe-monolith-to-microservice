import { openWebBrowser, visitPage } from "./test-utils.js";
import { afterAll, beforeAll, beforeEach, describe, test, expect } from "vitest";
import { Customer } from "./customer-dsl.js";
import { SalesClerk } from "./sales-clerk-dsl.js";

describe("Sales Clerk Journeys", () => {
    let browser;
    let customer;
    let salesClerk;

    beforeAll(async () => {
        const baseUrl = process.env.APP_URL || "http://localhost:8080";
        const debugEnabled = !!process.env.DEBUG_MODE;
        browser = await openWebBrowser(debugEnabled);
        customer = new Customer(await browser.newPage(), baseUrl);
        salesClerk = new SalesClerk(await browser.newPage(), baseUrl);
    });

    beforeEach(async () => {
        await salesClerk.visitHomePage();
        await customer.visitHomePage();
    });

    afterAll(async () => {
        await browser.close();
    });

    test("Inspects and reviews all the orders received", async () => {
        await salesClerk.takeOver();
        await salesClerk.verifyPageTitle(/The Tractor Store - Back Office/);

        await customer.takeOver();
        await customer.emptyShoppingCartIfNotEmpty();
        await customer.buyDisplayedProduct();
        await customer.checkout();
        const orderNumber = await customer.verifyOrderIsConfirmed();

        await salesClerk.takeOver();
        await salesClerk.reloadPage();
        await salesClerk.verifyOrdersListContains({
            orderNumber: orderNumber,
            totalAmount: "$58.00"
        });
    });

}, { timeout: 120_000 });
