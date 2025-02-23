import { sendEmail } from "@/utils/mailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { recipient } = req.body;

  const sender = process.env.MAIL_USER;
  const recipients = recipient;
  const subject = `SlideSmart - Your Verification Code`;
  const code = Math.floor(100000 + Math.random() * 900000);
  const message = `Your verification code is: ${code}. If you did not request this code, please ignore this email.`;

  try {
    const result = await sendEmail(sender, recipients, subject, message);
    res.status(200).json({ accepted: result.accepted, code });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: error.message });
  }
}
