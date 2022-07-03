import { Page } from "puppeteer";

export const generate = async (page: Page, url: string) => {
  await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: 5 * 60 * 1000,
  });

  await page.evaluate(() => {
    document.querySelector("header")?.remove();
    document
      .querySelector("div.spread > div")
      ?.setAttribute("style", "height: auto;");
  });

  const dashboard = await page.$(".Dashboard");
  let boundingBox = await dashboard?.boundingBox();
  let height = Math.ceil(boundingBox!.height);
  let width = Math.ceil(boundingBox!.width);

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
