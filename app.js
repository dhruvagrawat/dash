import { chromium } from 'playwright';

const browser = await chromium.connectOverCDP(connectionString);
const context = browser.contexts()[0];
const ai = context.serviceWorkers()[0];
const page = context.pages()[0];

// The following example shows form filling, including the ability to self-complete missing data in the form filling process.
await page.goto("https://formspree.io/library/donation/charity-donation-form/preview.html");

const result = await ai.evaluate('Fill out the form as if you were Michael Scott. For the phone number, choose one that ends with 9999')
console.info(result);
