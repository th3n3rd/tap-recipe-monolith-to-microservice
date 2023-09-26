import { getDocument, queries } from "pptr-testing-library";
import { expect } from "vitest";

const timeout = 5000;
const waitForOptions = { timeout: timeout }

export class SalesClerk {
    tab;
    document;
    baseUrl;

    constructor(tab, baseUrl) {
        this.tab = tab;
        this.baseUrl = baseUrl;
    }

    async takeOver() {
        await this.tab.bringToFront();
    }

    async visitHomePage() {
        await this.tab.goto(`${this.baseUrl}/admin`);
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

    async inspectOrders() {
        try {
            const rows = await queries.queryAllByRole(this.document, "row", {});
            const items = rows.slice(1); // remove the headers
            const orders = [];
            for (const item of items) {
                const cells = await queries.findAllByRole(item, "cell", {}, waitForOptions);
                const orderNumber = await cells[0].evaluate(element => element.textContent);
                const state = await cells[1].evaluate(element => element.textContent);
                const paymentMethod = await cells[2].evaluate(element => element.textContent);
                const totalAmount = await cells[3].evaluate(element => element.textContent);
                orders.push({
                    orderNumber: orderNumber,
                    state: state,
                    paymentMethod: paymentMethod,
                    totalAmount: totalAmount,
                });
            }
            return orders;
        } catch (error) {
            Error.captureStackTrace(error, this.inspectOrders);
            throw error;
        }
    }

    async figureOutNewlyAddedOrders(previouslyKnownOrders, currentOrders) {
        const knownOrderNumbers = previouslyKnownOrders.map(order => order.orderNumber);
        return currentOrders.filter(order => !knownOrderNumbers.includes(order.orderNumber))
    }

    async verifyNewlyAddedOrdersContain(previouslyKnownOrders, expectedOrders) {
        try {
            const allOrders = await this.inspectOrders();
            const newlyAddedOrders = await this.figureOutNewlyAddedOrders(previouslyKnownOrders, allOrders);
            expect(newlyAddedOrders).toHaveLength(expectedOrders.length);
            expectedOrders.forEach(expected => {
                expect(newlyAddedOrders).toContainEqual(expect.objectContaining(expected));
            });
        } catch (error) {
            Error.captureStackTrace(error, this.verifyNewlyAddedOrdersContain);
            throw error;
        }
    }

    async markNewlyAddedOrdersAdPaid(previouslyKnownOrders) {
        try {
            const allOrders = await this.inspectOrders();
            const newlyAddedOrders = await this.figureOutNewlyAddedOrders(previouslyKnownOrders, allOrders);
            for (const newOrder of newlyAddedOrders) {
                const row = await queries.findByRole(this.document, "row", { name: new RegExp(newOrder.orderNumber) }, waitForOptions);
                const markAsPaid = await queries.findByRole(row, "button", { name: /Mark as paid/ });
                await this.htmxSafeClick(markAsPaid);
            }
        } catch (error) {
            Error.captureStackTrace(error, this.markNewlyAddedOrdersAdPaid);
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
