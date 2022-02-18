import { Page } from "puppeteer";

export const generate = async (page: Page, url: string) => {
  await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });

  const dashboard = await page.$(".Dashboard");
  const boundingBox = await dashboard?.boundingBox();
  const height = Math.ceil(boundingBox!.height);
  const width = Math.ceil(boundingBox!.width);

  await page.setViewport({
    height,
    width,
    deviceScaleFactor: 2,
  });

  await page.evaluate(`const bodyStyle = document.getElementsByTagName('body')[0].style;
bodyStyle.width = '${width}px';
bodyStyle.height = '${height}px';`);

  return page.pdf({
    height,
    width,
    pageRanges: "1",
    printBackground: true,
  });
};
