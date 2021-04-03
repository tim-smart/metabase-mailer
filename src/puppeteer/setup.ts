import puppeteer from "puppeteer";

const isProduction = process.env.NODE_ENV === "production";

export async function page() {
  // Create browser & page
  const browser = await puppeteer.launch(
    isProduction
      ? {
          args: ["--disable-dev-shm-usage", "--no-sandbox"],
        }
      : {
          // headless: false,
        },
  );
  const page = await browser.newPage();

  return {
    browser,
    page,
  };
}
