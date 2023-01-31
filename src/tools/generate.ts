import { ReportLive } from "metabase-mailer/main"

Report.Report.accessWithEffect((_) => _.generate)
  .provideLayer(ReportLive)
  .tap((pdf) =>
    Effect(() => {
      process.stdout.write(pdf)
    }),
  )
  .catchAllCause((_) => _.logErrorCause).runPromise
