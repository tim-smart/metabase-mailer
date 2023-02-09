export interface ReportConfig {
  readonly reportPath: string

  readonly emailFrom: string
  readonly emailTo: string
  readonly emailCc: Maybe<string>
  readonly emailSubject: string
}

const make = (config: ReportConfig) =>
  Do($ => {
    const mail = $(Mail.Mail.access)
    const metabase = $(Metabase.Metabase.access)

    const link = metabase.url(config.reportPath)

    const generate = metabase.pdf(config.reportPath)

    const generateAndNotify = Do($ => {
      const pdf = $(generate)
      $(notify(pdf))
    })

    const notify = (pdf: Buffer) =>
      mail.send({
        from: config.emailFrom,
        to: config.emailTo,
        cc: config.emailCc.getOrUndefined,
        subject: config.emailSubject,
        attachments: [
          {
            content: pdf,
            filename: `${config.emailSubject}.pdf`,
          },
        ],
        text: `Hi, the "${config.emailSubject}" PDF is attached.

You can view the web version here: ${link}`,
      })

    return { generate, generateAndNotify }
  })

export interface Report extends Effect.Success<ReturnType<typeof make>> {}
export const Report = Tag<Report>()
export const makeLayer = (_: Config.Wrap<ReportConfig>) =>
  Config.unwrap(_).config.flatMap(make).toLayer(Report)
