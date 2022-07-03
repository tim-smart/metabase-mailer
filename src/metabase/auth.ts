import { Page } from "puppeteer";

export const login =
  (baseURL: string) => async (page: Page, email: string, password: string) => {
    await page.goto(`${baseURL}/auth/login`);
    await page.waitForSelector("#formField-username");

    await page.type("input[name=username]", email);
    await page.type("input[name=password]", password);
    await page.keyboard.press("Enter");

    await page.waitForNetworkIdle();
  };
