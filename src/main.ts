import Dotenv from "dotenv"

Dotenv.config()

const isProd = process.env.NODE_ENV === "production"

const PageLive = Puppeteer.makeLayer({
  args: isProd ? ["--disable-dev-shm-usage", "--no-sandbox"] : [],
  defaultViewport: {
    width: 1500,
    height: 1000,
    deviceScaleFactor: 2,
  },
})

const MailLive = Mail.makeLayer({
  host: Config.string("SMTP_HOST"),
  port: Config.integer("SMTP_PORT"),
  secure: Config.bool("SMTP_SECURE").withDefault(false),
  ignoreTLS: Config.bool("SMTP_IGNORE_TLS").withDefault(false),
  requireTLS: Config.bool("SMTP_REQUIRE_TLS").withDefault(false),
  auth: Config.struct({
    user: Config.string("SMTP_USER"),
    pass: Config.string("SMTP_PASS"),
  }).withDefault(undefined),
})

const MetabaseLive =
  PageLive >>
  Metabase.makeLayer({
    baseUrl: Config.string("METABASE_BASE_URL"),
    email: Config.string("METABASE_EMAIL"),
    password: Config.secret("METABASE_PASSWORD"),
  })

export const ReportLive =
  (MailLive + MetabaseLive) >>
  Report.makeLayer({
    reportPath: Config.string("METABASE_PDF_PATH"),
    emailFrom: Config.string("METABASE_EMAIL_FROM"),
    emailTo: Config.string("METABASE_EMAIL_TO"),
    emailCc: Config.string("METABASE_EMAIL_CC").optional,
    emailSubject: Config.string("METABASE_EMAIL_SUBJECT"),
  })

const program = Report.Report.accessWithEffect(
  _ => _.generateAndNotify,
).tapErrorCause(_ => _.logErrorCause)

program.provideLayer(ReportLive).runCallback(exit => {
  if (exit.isFailure()) {
    console.error(exit.cause.squash)
  }
})
