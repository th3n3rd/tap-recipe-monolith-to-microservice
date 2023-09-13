import { queries } from "pptr-testing-library";

export async function containsText(document, text) {
    await queries.findByText(document, text, {});
}

export async function displaysProductModel(document, model) {
    return containsText(document, model);
}

export async function switchToPlatinumEdition(document) {
    const checkbox = await queries.findByLabelText(document, /Platinum Edition/);
    await checkbox.click();
}

export async function displaysStandardProductImage(document, product) {
    await queries.findByAltText(document, new RegExp(`^The standard edition version of the ${product}`));
}

export async function displaysPlatinumProductImage(document, product) {
    await queries.findByAltText(document, new RegExp(`^The platinum edition version of the ${product}`));
}

export async function displayProductPrice(document, price) {
    await queries.findByText(document, new RegExp(`Buy for \\${price}`));
}

export async function buyProduct(document) {
    const buy = await queries.findByRole(document, "button", { name: /Buy for/ });
    await buy.click();
}

export async function shoppingCartContains(document, numberOfElements) {
    await queries.findByText(document, new RegExp(`You've picked ${numberOfElements} items`))
}

export async function shoppingCartIsEmpty(document) {
    await queries.findByText(document, new RegExp(`Your cart is empty`))
}

export async function shoppingCartTotals(document, total) {
    await queries.findByText(document, new RegExp(`for a total of \\${total}`))
}

export async function emptyShoppingCart(document) {
    const emptyCart = await queries.findByRole(document, "button", { name: /Empty cart/ })
    await emptyCart.click();
}

export async function displaysRecommendations(document, products) {
    const recommendations = await queries.findByRole(document, "region", { name: /Recommendations/ });
    for (const product of products) {
        await queries.findByAltText(recommendations, new RegExp(`^A recommendation for the standard edition version of the ${product}`));
    }
}

export async function selectRecommendedProduct(document, product) {
    const recommendation = await queries.findByAltText(document, new RegExp(`^A recommendation for the standard edition version of the ${product}`));
    await recommendation.click();
}
