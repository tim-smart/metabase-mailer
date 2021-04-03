import Nodemailer from "nodemailer";

const transport = Nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: +process.env.SMTP_PORT! || 25,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const send = async ({
  to,
  from,
  subject,
  link,
  pdf,
}: {
  to: string;
  from: string;
  subject: string;
  link: string;
  pdf: Buffer;
}) =>
  new Promise<any>((resolve, reject) => {
    transport.sendMail(
      {
        from,
        to,
        subject,
        attachments: [
          {
            content: pdf,
            filename: `${subject}.pdf`,
          },
        ],
        text: `Hi, the "${subject}" PDF is attached.

You can view the web version here: ${link}`,
      },
      (err, info) => {
        if (err) {
          return reject(err);
        }

        resolve(info);
      },
    );
  });
