import { chromium } from '@playwright/test';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.on('pageerror',error=>console.error(error));
await page.goto('http://127.0.0.1:4173');await page.waitForFunction(()=>[...document.images].every(i=>i.complete));
await page.screenshot({path:'docs/desktop.png'});
await page.setViewportSize({width:390,height:844});await page.screenshot({path:'docs/portrait.png'});
await browser.close();
