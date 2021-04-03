import { Page } from "puppeteer";

export const login = (baseURL: string) => async (
  page: Page,
  email: string,
  password: string,
) => {
  await page.goto(`${baseURL}/auth/login`);
  await page.waitForSelector("#formField-username");

  await page.type("#formField-username input", email);
  await page.type("#formField-password input", password);
  await page.click("button[type=submit]");

  await page.waitForSelector("div.Nav");
};
