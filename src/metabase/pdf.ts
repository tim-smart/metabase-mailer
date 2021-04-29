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

  const dashboard = await page.$(".Dashboard");
  const boundingBox = await dashboard?.boundingBox();

  await new Promise((resolve) => setTimeout(resolve, 5000));

  return page.pdf({
    height: boundingBox?.height,
    width: boundingBox?.width,
    printBackground: true,
  });
};
