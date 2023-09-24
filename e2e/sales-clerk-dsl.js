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
            const rows = await queries.findAllByRole(this.document, "row", {}, waitForOptions);
            const items = rows.slice(1); // remove the headers
            const orders = [];
            for (const item of items) {
                const cells = await queries.findAllByRole(item, "cell", {}, waitForOptions);
                const orderNumber = await cells[0].evaluate(element => element.textContent);
                const state = await cells[1].evaluate(element => element.textContent);
                const totalAmount = await cells[2].evaluate(element => element.textContent);
                orders.push({
                    orderNumber: orderNumber,
                    state: state,
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

}
