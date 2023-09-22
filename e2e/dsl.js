import { queries } from "pptr-testing-library";
import { expect } from "vitest";

const timeout = 5000;
const waitForOptions = { timeout: timeout }

function waitForHtmxToSettle() {
    // htmx by default uses 20ms in order to settle the new attributes on inserted elements
    // this seems to affect buttons/clicks that might happen right after insertion
    return new Promise(resolve => setTimeout(resolve, 50));
}

async function htmxSafeClick(element) {
    await waitForHtmxToSettle();
    await element.click();
}

export async function displaysPageTitle(document, title) {
    try {
        await queries.findByRole(document, "heading", { level: 1, name: title }, waitForOptions);
    } catch (error) {
        Error.captureStackTrace(error, displaysPageTitle);
        throw error;
    }
}

export async function displaysProductTitle(document, model) {
    try {
        await queries.findByRole(document, "heading", { level: 2, name: model }, waitForOptions);
    } catch (error) {
        Error.captureStackTrace(error, displaysProductTitle);
        throw error;
    }
}

export async function switchToPlatinumEdition(document) {
    try {
        const checkbox = await queries.findByLabelText(document, /Platinum Edition/, {}, waitForOptions);
        await htmxSafeClick(checkbox);
    } catch (error) {
        Error.captureStackTrace(error, switchToPlatinumEdition);
        throw error;
    }
}

export async function displaysStandardProductImage(document, product) {
    try {
        await queries.findByAltText(document, new RegExp(`^The standard edition version of the ${product}`), {}, waitForOptions);
    } catch (error) {
        Error.captureStackTrace(error, displaysStandardProductImage);
        throw error;
    }
}

export async function displaysPlatinumProductImage(document, product) {
    try {
        await queries.findByAltText(document, new RegExp(`^The platinum edition version of the ${product}`), {}, waitForOptions);
    } catch (error) {
        Error.captureStackTrace(error, displaysPlatinumProductImage);
        throw error;
    }
}

export async function displaysProductPrice(document, price) {
    try {
        await queries.findByText(document, new RegExp(`Buy for \\${price}`), {}, waitForOptions);
    } catch (error) {
        Error.captureStackTrace(error, buyDisplayedProduct);
        throw error;
    }
}

export async function buyDisplayedProduct(document) {
    try {
        const buy = await queries.findByRole(document, "button", { name: /Buy for/ }, waitForOptions);
        await htmxSafeClick(buy);
    } catch (error) {
        Error.captureStackTrace(error, buyDisplayedProduct);
        throw error;
    }
}

export async function shoppingCartContains(document, numberOfElements) {
    try {
        await queries.findByText(document, new RegExp(`You've picked ${numberOfElements} items`), {}, waitForOptions);
    } catch (error) {
        Error.captureStackTrace(error, shoppingCartContains);
        throw error;
    }
}

export async function shoppingCartIsEmpty(document) {
    try {
        await queries.findByText(document, new RegExp(`Your cart is empty`), {}, waitForOptions);
    } catch (error) {
        Error.captureStackTrace(error, shoppingCartIsEmpty);
        throw error;
    }
}

export async function shoppingCartTotals(document, total) {
    try {
        await queries.findByText(document, new RegExp(`for a total of \\${total}`), {}, waitForOptions);
    } catch (error) {
        Error.captureStackTrace(error, shoppingCartTotals);
        throw error;
    }
}

export async function emptyShoppingCart(document) {
    try {
        const emptyCart = await queries.findByRole(document, "button", { name: /Empty cart/ }, waitForOptions);
        await htmxSafeClick(emptyCart);
    } catch (error) {
        Error.captureStackTrace(error, emptyShoppingCart);
        throw error;
    }
}

export async function emptyShoppingCartIfNotEmpty(document) {
    try {
        const emptyCart = await queries.findByRole(document, "button", { name: /Empty cart/ }, waitForOptions);
        await htmxSafeClick(emptyCart);
    } catch (error) {
        // ignore errors
    }
}

export async function displaysRecommendations(document, products) {
    try {
        const recommendations = await queries.findByRole(document, "region", { name: /Recommendations/ }, waitForOptions);
        for (const product of products) {
            await queries.findByAltText(recommendations, new RegExp(`^A recommendation for the standard edition version of the ${product}`), {}, waitForOptions);
        }
    } catch (error) {
        Error.captureStackTrace(error, displaysRecommendations);
        throw error;
    }
}

export async function selectRecommendedProduct(document, product) {
    try {
        const recommendation = await queries.findByAltText(document, new RegExp(`^A recommendation for the standard edition version of the ${product}`), {}, waitForOptions);
        await htmxSafeClick(recommendation);
    } catch (error) {
        Error.captureStackTrace(error, selectRecommendedProduct);
        throw error;
    }
}

export async function checkout(document) {
    try {
        const checkout = await queries.findByRole(document, "button", { name: /Checkout/ }, waitForOptions);
        await htmxSafeClick(checkout);
    } catch (error) {
        Error.captureStackTrace(error, checkout);
        throw error;
    }
}

export async function displaysOrderConfirmation(document) {
    try {
        await queries.findByText(document, /Your order is confirmed!/, {}, waitForOptions);
        const orderNumber = await queries.findByTestId(document, "order-number", {}, waitForOptions);
        return await orderNumber.evaluate(element => element.textContent);
    } catch (error) {
        Error.captureStackTrace(error, displaysOrderConfirmation);
        throw error;
    }
}

export async function orderContainsItems(document, expectedItems) {
    try {
        const rows = await queries.findAllByRole(document, "row", {}, waitForOptions);
        const items = rows.slice(1, rows.length - 1); // remove the headers and the total amount
        expect(items.length).toEqual(expectedItems.length);
        for (let i = 0; i < items.length; i++){
            const item = items[i];
            const expectedItem = expectedItems[i];
            const content = await item.evaluate(element => element.textContent)
            expect(content).toContain(expectedItem.name);
            expect(content).toContain(expectedItem.price);
        }
    } catch (error) {
        Error.captureStackTrace(error, orderContainsItems);
        throw error;
    }
}

export async function orderTotals(document, total) {
    try {
        await queries.findByText(document, new RegExp(`Total amount \\${total}`), waitForOptions);
    } catch (error) {
        Error.captureStackTrace(error, orderTotals);
        throw error;
    }
}

export async function continueShopping(document) {
    try {
        const continueShopping = await queries.findByRole(document, "button", { name: /Continue shopping/ }, waitForOptions);
        await htmxSafeClick(continueShopping);
    } catch (error) {
        Error.captureStackTrace(error, continueShopping);
        throw error;
    }
}
