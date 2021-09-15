require("dotenv").config();

import { login } from "../metabase/auth";
import * as Pdf from "../metabase/pdf";
import * as Setup from "../puppeteer/setup";

async function main() {
  const baseURL = process.env.METABASE_BASE_URL!;

  const { browser, page } = await Setup.page({
    width: 1500,
    height: 1000,
    deviceScaleFactor: 2,
  });

  await login(baseURL)(
    page,
    process.env.METABASE_EMAIL!,
    process.env.METABASE_PASSWORD!
  );

  const reportURL = `${baseURL}/dashboard/${process.argv[2]}`;
  const pdfBuffer = await Pdf.generate(page, reportURL);

  await browser.close();

  process.stdout.write(pdfBuffer);
}

main();
