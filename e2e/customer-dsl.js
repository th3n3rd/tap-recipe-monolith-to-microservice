import { getDocument, queries } from "pptr-testing-library";
import { expect } from "vitest";

const timeout = 5000;
const waitForOptions = { timeout: timeout }

export class Customer {
    tab;
    document;
    baseUrl;

    constructor(tab, baseUrl) {
        this.baseUrl = baseUrl;
        this.tab = tab;
    }

    async takeOver() {
        await this.tab.bringToFront();
    }

    async visitHomePage() {
        await this.tab.goto(`${this.baseUrl}/`);
        this.document = await getDocument(this.tab);
    }
    
    async reloadPage() {
        await this.tab.reload();
        this.document = await getDocument(this.tab);
    }

    async verifyPageTitle(title) {
        try {
            await queries.findByRole(this.document, "heading", { level: 1, name: title }, waitForOptions);
        } catch (error) {
            Error.captureStackTrace(error, this.verifyPageTitle);
            throw error;
        }
    }

    async verifyProductTitle(model) {
        try {
            await queries.findByRole(this.document, "heading", { level: 2, name: model }, waitForOptions);
        } catch (error) {
            Error.captureStackTrace(error, this.verifyProductTitle);
            throw error;
        }
    }

    async switchToPlatinumEdition() {
        try {
            const checkbox = await queries.findByLabelText(this.document, /Platinum Edition/, {}, waitForOptions);
            await this.htmxSafeClick(checkbox);
        } catch (error) {
            Error.captureStackTrace(error, this.switchToPlatinumEdition);
            throw error;
        }
    }

    async verifiesStandardProductImage(product) {
        try {
            await queries.findByAltText(this.document, new RegExp(`^The standard edition version of the ${product}`), {}, waitForOptions);
        } catch (error) {
            Error.captureStackTrace(error, this.verifiesStandardProductImage);
            throw error;
        }
    }

    async verifiesPlatinumProductImage(product) {
        try {
            await queries.findByAltText(this.document, new RegExp(`^The platinum edition version of the ${product}`), {}, waitForOptions);
        } catch (error) {
            Error.captureStackTrace(error, this.verifiesPlatinumProductImage);
            throw error;
        }
    }

    async verifiesProductPrice(price) {
        try {
            await queries.findByText(this.document, new RegExp(`Buy for \\${price}`), {}, waitForOptions);
        } catch (error) {
            Error.captureStackTrace(error, this.buyDisplayedProduct);
            throw error;
        }
    }

    async buyDisplayedProduct() {
        try {
            const buy = await queries.findByRole(this.document, "button", { name: /Buy for/ }, waitForOptions);
            await this.htmxSafeClick(buy);
        } catch (error) {
            Error.captureStackTrace(error, this.buyDisplayedProduct);
            throw error;
        }
    }

    async verifyShoppingCartContains(numberOfElements) {
        try {
            await queries.findByText(this.document, new RegExp(`You've picked ${numberOfElements} items`), {}, waitForOptions);
        } catch (error) {
            Error.captureStackTrace(error, this.verifyShoppingCartContains);
            throw error;
        }
    }

    async verifyShoppingCartIsEmpty() {
        try {
            await queries.findByText(this.document, new RegExp(`Your cart is empty`), {}, waitForOptions);
        } catch (error) {
            Error.captureStackTrace(error, this.verifyShoppingCartIsEmpty);
            throw error;
        }
    }

    async reviewShoppingCart(){
        try {
            const review = await queries.findByRole(this.document, "button", { name: /View cart/ }, waitForOptions);
            await this.htmxSafeClick(review);
        } catch (error) {
            Error.captureStackTrace(error, this.reviewShoppingCart);
            throw error;
        }
    }

    async verifyShoppingCartTitle() {
        try {
            await queries.findByRole(this.document, "heading", { level: 2, name: /Shopping Cart/ }, waitForOptions)
        } catch (error) {
            Error.captureStackTrace(error, this.verifyShoppingCartTitle);
            throw error;
        }
    }

    async verifyShoppingCartContainsItems(expectedItems) {
        try {
            const rows = await queries.findAllByRole(this.document, "row", {}, waitForOptions);
            const items = rows.slice(1, rows.length - 1); // remove the headers and the total amount
            expect(items.length).toEqual(expectedItems.length);
            for (let i = 0; i < items.length; i++){
                const item = items[i];
                const expectedItem = expectedItems[i];
                const content = await item.evaluate(element => element.textContent)
                expect(content).toContain(expectedItem.model);
                expect(content).toContain(expectedItem.edition);
                expect(content).toContain(expectedItem.price);
            }
        } catch (error) {
            Error.captureStackTrace(error, this.verifyShoppingCartContainsItems);
            throw error;
        }
    }

    async verifiesShoppingCartTotals(total) {
        try {
            await queries.findByText(this.document, new RegExp(`for a total of \\${total}`), {}, waitForOptions);
        } catch (error) {
            Error.captureStackTrace(error, this.verifiesShoppingCartTotals);
            throw error;
        }
    }

    async emptyShoppingCart() {
        try {
            const emptyCart = await queries.findByRole(this.document, "button", { name: /Empty cart/ }, waitForOptions);
            await this.htmxSafeClick(emptyCart);
        } catch (error) {
            Error.captureStackTrace(error, this.emptyShoppingCart);
            throw error;
        }
    }

    async emptyShoppingCartIfNotEmpty() {
        try {
            const emptyCart = await queries.findByRole(this.document, "button", { name: /Empty cart/ }, waitForOptions);
            await this.htmxSafeClick(emptyCart);
        } catch (error) {
            // ignore errors
        }
    }

    async verifiesRecommendations(products) {
        try {
            const recommendations = await queries.findByRole(this.document, "region", { name: /Recommendations/ }, waitForOptions);
            for (const product of products) {
                await queries.findByAltText(recommendations, new RegExp(`^A recommendation for the standard edition version of the ${product}`), {}, waitForOptions);
            }
        } catch (error) {
            Error.captureStackTrace(error, this.verifiesRecommendations);
            throw error;
        }
    }

    async selectRecommendedProduct(product) {
        try {
            const recommendation = await queries.findByAltText(this.document, new RegExp(`^A recommendation for the standard edition version of the ${product}`), {}, waitForOptions);
            await this.htmxSafeClick(recommendation);
        } catch (error) {
            Error.captureStackTrace(error, this.selectRecommendedProduct);
            throw error;
        }
    }

    async checkout() {
        try {
            const checkout = await queries.findByRole(this.document, "button", { name: /Checkout/ }, waitForOptions);
            await this.htmxSafeClick(checkout);
        } catch (error) {
            Error.captureStackTrace(error, this.checkout);
            throw error;
        }
    }

    async decideToPayOverThePhone() {
        try {
            const paymentMethod = await queries.findByRole(this.document, "radio", { name: /Pay over the phone/ }, waitForOptions);
            await this.htmxSafeClick(paymentMethod);
            const continueCheckout = await queries.findByRole(this.document, "button", { name: /Continue/ }, waitForOptions);
            await this.htmxSafeClick(continueCheckout);
        } catch (error) {
            Error.captureStackTrace(error, this.decideToPayOverThePhone);
            throw error;
        }
    }

    async verifyOrderIsConfirmed() {
        try {
            await queries.findByText(this.document, /Your order is confirmed!/, {}, waitForOptions);
            const orderNumber = await queries.findByTestId(this.document, "order-number", {}, waitForOptions);
            return await orderNumber.evaluate(element => element.textContent);
        } catch (error) {
            Error.captureStackTrace(error, this.verifyOrderIsConfirmed);
            throw error;
        }
    }

    async verifyOrderContainsItems(expectedItems) {
        try {
            const rows = await queries.findAllByRole(this.document, "row", {}, waitForOptions);
            const items = rows.slice(1, rows.length - 1); // remove the headers and the total amount
            expect(items.length).toEqual(expectedItems.length);
            for (let i = 0; i < items.length; i++){
                const item = items[i];
                const expectedItem = expectedItems[i];
                const content = await item.evaluate(element => element.textContent)
                expect(content).toContain(expectedItem.model);
                expect(content).toContain(expectedItem.edition);
                expect(content).toContain(expectedItem.price);
            }
        } catch (error) {
            Error.captureStackTrace(error, this.verifyOrderContainsItems);
            throw error;
        }
    }

    async verifyOrderTotals(total) {
        try {
            await queries.findByText(this.document, new RegExp(`Total amount \\${total}`), waitForOptions);
        } catch (error) {
            Error.captureStackTrace(error, this.verifyOrderTotals);
            throw error;
        }
    }
    async continueShopping() {
        try {
            const continueShopping = await queries.findByRole(this.document, "button", { name: /Continue shopping/ }, waitForOptions);
            await this.htmxSafeClick(continueShopping);
        } catch (error) {
            Error.captureStackTrace(error, this.continueShopping);
            throw error;
        }
    }

    waitForHtmxToSettle() {
        // htmx by default uses 20ms in order to settle the new attributes on inserted elements
        // this seems to affect buttons/clicks that might happen right after insertion
        return new Promise(resolve => setTimeout(resolve, 50));
    }

    async htmxSafeClick(element) {
        await this.waitForHtmxToSettle();
        await element.click();
    }
}
