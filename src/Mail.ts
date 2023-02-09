import Nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js"
import Mailer from "nodemailer/lib/mailer/index.js"

export class SendMailError {
  readonly _tag = "SendMailError"
  constructor(readonly error: Error) {}
}

const make = (opts: SMTPTransport.Options) => {
  const transport = Nodemailer.createTransport(opts)

  const send = (msg: Mailer.Options) =>
    Effect.async<never, SendMailError, SMTPTransport.SentMessageInfo>(
      resume => {
        transport.sendMail(msg, (err, info) => {
          if (err) {
            resume(Effect.fail(new SendMailError(err)))
          } else {
            resume(Effect.succeed(info))
          }
        })
      },
    )

  return { send }
}

export interface Mail extends ReturnType<typeof make> {}
export const Mail = Tag<Mail>()

export const makeLayer = (_: Config.Wrap<SMTPTransport.Options>) =>
  Config.unwrap(_).config.map(make).toLayer(Mail)
