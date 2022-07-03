import puppeteer, { Viewport } from "puppeteer";

const isProduction = process.env.NODE_ENV === "production";

export async function page(defaultViewport?: Viewport) {
  // Create browser & page
  const browser = await puppeteer.launch(
    isProduction
      ? { args: ["--disable-dev-shm-usage", "--no-sandbox"], defaultViewport }
      : { defaultViewport }
  );
  const page = await browser.newPage();

  return {
    browser,
    page,
  };
}
