require("dotenv").config();

import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option"
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

  const cc = pipe(
    O.fromNullable(process.env.METABASE_EMAIL_CC),
    O.map((s) => s.trim()),
    O.filter(s => s !== ""),
    O.toUndefined
  )

  await Promise.all([
    Email.send({
      from: process.env.METABASE_EMAIL_FROM!,
      to: process.env.METABASE_EMAIL_TO!,
      cc,
      subject: process.env.METABASE_EMAIL_SUBJECT!,
      link: reportURL,
      pdf: pdfBuffer,
    }),
    browser.close(),
  ]);
}

main();
