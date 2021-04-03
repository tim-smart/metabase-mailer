import { Page } from "puppeteer";

export const generate = async (page: Page, url: string) => {
  await page.goto(url, {
    waitUntil: "networkidle2",
  });

  await page.setViewport({
    height: 1080,
    width: 1920,
    deviceScaleFactor: 2,
  });

  return page.pdf({
    scale: 0.75,
    format: "a3",
    printBackground: true,
  });
};
