import { Page } from "puppeteer";

export const generate = async (page: Page, url: string) => {
  await page.goto(url, {
    waitUntil: "networkidle0",
  });

  const dashboard = await page.$(".Dashboard");
  const boundingBox = await dashboard?.boundingBox();

  return page.pdf({
    height: boundingBox?.height,
    width: boundingBox?.width,
    pageRanges: "1",
    printBackground: true,
  });
};
