import { Page } from "puppeteer";

export const generate = async (page: Page, url: string) => {
  await page.goto(url, {
    waitUntil: "networkidle0",
  });

  await page.setViewport({
    height: 1000,
    width: 1500,
    deviceScaleFactor: 2,
  });

  // Allow time for page to redraw
  await page.waitForTimeout(2000);

  const dashboard = await page.$(".Dashboard");
  const boundingBox = await dashboard?.boundingBox();

  return page.pdf({
    height: boundingBox?.height,
    width: boundingBox?.width,
    printBackground: true,
  });
};
