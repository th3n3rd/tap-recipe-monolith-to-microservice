import puppeteer from "puppeteer";
import {getDocument, queries, configure} from "pptr-testing-library";

const url = process.argv[2];
if (!url) {
    console.error('Please provide a URL as the first parameter.');
    process.exit(1);
}

// global testing-library timeout
configure({
    asyncUtilTimeout: 3000
});

(async () => {
    const { browser, document } = await openWebapp(url);

    await containsText(document, /The Tractor Store/);
    await displaysProductModel(document, "Eicher Diesel 215/16");
    await displaysStandardProductImage(document, "Eicher Diesel 215/16");
    await displayProductPrice(document, "$58");

    await shoppingCartIsEmpty(document);
    await buyProduct(document);
    await shoppingCartContains(document, 1);
    await buyProduct(document);
    await shoppingCartContains(document, 2);
    await shoppingCartTotals(document, "$116")

    await switchToPlatinumEdition(document);
    await displaysPlatinumProductImage(document, "Eicher Diesel 215/16");
    await displayProductPrice(document, "$958");
    await buyProduct(document);
    await shoppingCartContains(document, 3);
    await shoppingCartTotals(document, "$1074")

    await browser.close();
})();

async function openWebapp(pageUrl) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(pageUrl);
    const document = await getDocument(page);
    return { browser, document }
}

async function containsText(document, text) {
    await queries.findByText(document, text, {});
}

async function displaysProductModel(document, model) {
    return containsText(document, model);
}

async function switchToPlatinumEdition(document) {
    const checkbox = await queries.findByLabelText(document, /Platinum Edition/);
    await checkbox.click();
}

async function displaysStandardProductImage(document, product) {
    await queries.findByAltText(document, new RegExp(`^The standard edition version of the ${product}`));
}

async function displaysPlatinumProductImage(document, product) {
    await queries.findByAltText(document, new RegExp(`^The platinum edition version of the ${product}`));
}

async function displayProductPrice(document, price) {
    await queries.findByText(document, new RegExp(`Buy for \\${price}`));
}

async function buyProduct(document) {
    const buy = await queries.findByRole(document, "button", { name: /Buy for/ });
    await buy.click();
}

async function shoppingCartContains(document, numberOfElements) {
    await queries.findByText(document, new RegExp(`You've picked ${numberOfElements} items`))
}

async function shoppingCartIsEmpty(document) {
    await queries.findByText(document, new RegExp(`Your cart is empty`))
}

async function shoppingCartTotals(document, total) {
    await queries.findByText(document, new RegExp(`for a total of \\${total}`))
}
