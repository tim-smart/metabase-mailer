import { Page } from "puppeteer";

export const generate = async (page: Page, url: string) => {
  await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: 5 * 60 * 1000,
  });

  await page.evaluate(() => {
    document.documentElement.setAttribute("style", "width: 100%;");
    const content = document.querySelector(
      "div[data-testid=dashboard-parameters-and-cards]"
    );
    if (content) {
      document.body.appendChild(content);
      document.getElementById("root")?.remove();

      content.setAttribute("id", "dashboard");
      content.setAttribute("class", "");
      content.setAttribute(
        "style",
        "height: auto; box-sizing: content-box; padding-bottom: 75px;"
      );
    }
  });

  const dashboard = await page.$("#dashboard");
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
    height: height,
    width,
    pageRanges: "1",
    printBackground: true,
  });
};
