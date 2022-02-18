require("dotenv").config();

import * as Email from "./email";
import { login } from "./metabase/auth";
import * as Pdf from "./metabase/pdf";
import * as Setup from "./puppeteer/setup";

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

  const reportURL = `${baseURL}${process.env.METABASE_PDF_PATH}`;
  const pdfBuffer = await Pdf.generate(page, reportURL);

  await Promise.all([
    Email.send({
      from: process.env.METABASE_EMAIL_FROM!,
      to: process.env.METABASE_EMAIL_TO!,
      subject: process.env.METABASE_EMAIL_SUBJECT!,
      link: reportURL,
      pdf: pdfBuffer,
    }),
    browser.close(),
  ]);
}

main();
