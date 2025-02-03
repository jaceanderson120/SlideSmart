import { sendEmail } from "@/utils/mailer";

// Credit: https://rupali.hashnode.dev/send-emails-in-nodejs-using-nodemailer-gmail-oauth2

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    accountName,
    accountEmail,
    firstName,
    lastName,
    email,
    subject: emailSubject,
    body,
  } = req.body;

  const sender = process.env.MAIL_USER;
  const recipients = "brayden@thepettigrews.org";
  const subject = `SlideSmart Contact Form`;
  const message = `From: ${accountName} <${accountEmail}>\n\nName: ${firstName} ${lastName}\nEmail: ${email}\n\nSubject: ${emailSubject}\nBody: ${body}`;

  try {
    const result = await sendEmail(sender, recipients, subject, message);
    res.status(200).json({ accepted: result.accepted });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: error.message });
  }
}
