import { ReportLive } from "metabase-mailer/main"
import * as Report from "metabase-mailer/Report"

Report.Report.accessWithEffect(_ => _.generate)
  .provideLayer(ReportLive)
  .tap(pdf =>
    Effect(() => {
      process.stdout.write(pdf)
    }),
  )
  .tapErrorCause(_ => _.logErrorCause).runPromise
