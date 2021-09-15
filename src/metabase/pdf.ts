import { Page } from "puppeteer";

export const generate = async (page: Page, url: string) => {
  await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });

  const dashboard = await page.$(".Dashboard");
  const boundingBox = await dashboard?.boundingBox();

  await page.setViewport({
    height: boundingBox!.height,
    width: boundingBox!.width,
    deviceScaleFactor: 2,
  });

  await page.evaluate(`const bodyStyle = document.getElementsByTagName('body')[0].style;
bodyStyle.width = '${boundingBox!.width}px';
bodyStyle.height = '${boundingBox!.height}px';`);

  return page.pdf({
    height: boundingBox?.height,
    width: boundingBox?.width,
    pageRanges: "1",
    printBackground: true,
  });
};
